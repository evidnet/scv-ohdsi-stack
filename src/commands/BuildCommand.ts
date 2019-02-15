import { BuildImageCommand, copy, KVMap, Logger, OptionModel, remove, TagValue } from '@evidnet/scv-core'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import util from 'util'
import { githubKey } from '../../secret.json'
import { GitTag } from '../models/GitHubResponse'

const createDirectory = util.promisify(fs.mkdir)

// JS 설정 파일의 경로를 버전별로 분류합니다.
const configPath: TagValue = (tag?: string) => {
  if (tag === undefined) return 'js/config.js'

  const major = parseInt(tag.split('.')[0], 10)
  const minor = parseInt(tag.split('.')[1], 10)
  return major >= 2 && minor >= 6 ? 'js/config/app.js' : 'js/config.js'
}

// 설정 파일의 파일 순수 이름을 반환합니다.
const configFile: TagValue = (tag?: string) => {
  if (tag === undefined) return 'config.js'
  const arr = configPath(tag).split('/')
  return arr[arr.length - 1]
}

// 패치를 적용할 파일을 선택합니다.
const patchFile: TagValue = (tag?: string) => {
  if (tag === undefined) return 'CDMResultsService.2_5.java'

  const major = parseInt(tag.split('.')[0], 10)
  const minor = parseInt(tag.split('.')[1], 10)
  return major >= 2 && minor >= 6 ? 'CDMResultsService.2_6.java' : 'CDMResultsService.2_5.java'
}

// 2.5.x라면 2.5.x 버전 중 가장 최신 버전을 가져오도록 합니다.
const getVersion: ((project: string) => TagValue) = (project: string) => {
  const url = `https://api.github.com/repos/OHDSI/${project}/tags?access_token=${githubKey}`

  return async (tag?: string) => {
    if (tag === undefined) throw new Error('Tag must be not-null!')

    const response = await fetch(url)
    const body: Array<GitTag> = await response.json()

    // 1. filter as same major and minor version.
    const filtered = body.filter(gitTag => {
      const majorOrigin = parseInt(tag.split('.')[0], 10)
      const minorOrigin = parseInt(tag.split('.')[1], 10)

      const major = parseInt(gitTag.name.replace('v', '').split('.')[0], 10)
      const minor = parseInt(gitTag.name.replace('v', '').split('.')[1], 10)

      return majorOrigin === major && minorOrigin === minor
    })

    // 2. map and sort it.
    // 3. return last one
    const results = filtered.map(gitTag => gitTag.name.replace('v', '')).sort()
    return results[results.length - 1]
  }
}

export class BuildCommand extends BuildImageCommand {
  substituteMap: Map<string, TagValue> = new Map<string, TagValue>([
    ['@base', 'amd64/ubuntu:16.04'],
    ['@atlasVer', getVersion('Atlas')],
    ['@webAPIVer', getVersion('WebAPI')],
    ['@configPath', configPath],
    ['@configFile', configFile],
    ['@patchFile', patchFile]
  ])

  tags: string[] = ['2.5.1', '2.6.1']

  imageName: string = 'evidnet/ohdsi-stack'

  dockerFile: string = './assets/Dockerfile.template'

  getCommandAlias (): string {
    return 'b'
  }

  getOptions (): Array<OptionModel> {
    return []
  }

  getSources (): Array<string> {
    return [
      // Scripts
      'install',
      'tomcat-start',
      'tomcat-stop',

      // Tomcat Patch
      'context.xml',
      'setenv.sh',

      // Atlas Patch
      'config.js',
      'app.js',

      // WebAPI Patch
      'CDMResultsService.2_5.java',
      'CDMResultsService.2_6.java',
      'search.sql'
    ]
  }

  async onEvaluated (args: KVMap, options: KVMap, logger: Logger): Promise<void> {
    const tempPath = path.join(process.cwd(), './.tmp/')

    try {
      await remove(tempPath)
    } catch (_) {
      // ignored
    }

    await createDirectory(tempPath)
    await Promise.all(
      this.getSources().map(source => {
        let filePath: string

        // 폴더별로 분류해놨기 때문에 파일 path를 이렇게 지정해줍니다.
        if (source.indexOf('.js') !== -1) filePath = `../../assets/javascript/${source}`
        else if (source.indexOf('.java') !== -1) filePath = `../../assets/java/${source}`
        else if (source.indexOf('tomcat') !== -1) filePath = `../../assets/tomcat/${source}`
        else filePath = `../../assets/${source}`

        return copy(path.join(__dirname, filePath), path.join(process.cwd(), `./.tmp/${source}`))
      })
    )

    await this.baseEvaluated(args, options, logger)
    return remove(tempPath)
  }
}

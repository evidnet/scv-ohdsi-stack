import { BuildImageCommand, copy, KVMap, Logger, OptionModel, remove, TagValue } from '@evidnet/scv-core'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import util from 'util'
import { githubKey } from '../../secret.json'
import { GitTag } from '../models/GitHubResponse'

const createDirectory = util.promisify(fs.mkdir)

const scriptPath = 'install'
const configFile: TagValue = (tag?: string) => {
  if (tag === undefined) return 'js/config.js'

  const major = parseInt(tag.split('.')[0], 10)
  const minor = parseInt(tag.split('.')[1], 10)
  return major >= 2 && minor >= 6 ? 'js/config/app.js' : 'js/config.js'
}

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
    ['@configFile', configFile],
    ['@scriptPath', scriptPath]
  ])

  tags: string[] = ['2.5', '2.6']

  imageName: string = 'evidnet/ohdsi-stack'

  dockerFile: string = './assets/Dockerfile.template'

  getCommandAlias (): string {
    return 'b'
  }

  getOptions (): Array<OptionModel> {
    return []
  }

  getSources (): Array<string> {
    return ['install']
  }

  async onEvaluated (args: KVMap, options: KVMap, logger: Logger): Promise<void> {
    const tempPath = path.join(process.cwd(), './.tmp/')

    try {
      await remove(tempPath)
    } catch (_) {
      // ignored
    }

    await createDirectory(tempPath)
    await copy(path.join(__dirname, '../../assets/install'), path.join(process.cwd(), './.tmp/install'))
    await this.baseEvaluated(args, options, logger)
    return remove(tempPath)
  }
}

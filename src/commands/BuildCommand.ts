import { BuildImageCommand } from '@evidnet/scv-core'

type TagCallback = ((tag: string) => string)
type TagValue = string | TagCallback

export class BuildCommand extends BuildImageCommand {
  substituteMap: Map<string, TagValue> = new Map<string, TagValue>([
    ['@base', 'amd64/ubuntu:18.04'],
    ['@tag', (tag: string) => tag]
  ])

  tags: string[] = []

  imageName: string = 'evidnet/ohdsi-stack'

  dockerFile: string = './assets/Dockerfile.template'

  getCommandAlias (): string {
    return 'b'
  }
}

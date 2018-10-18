import { PublishImageCommand } from '@evidnet/scv-core'

export class PublishCommand extends PublishImageCommand {
  rootProject: string = 'base-images'
  project: string = 'evidnet/r-base'
}

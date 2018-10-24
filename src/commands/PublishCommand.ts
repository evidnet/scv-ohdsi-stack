import { PublishImageCommand, OptionModel } from '@evidnet/scv-core'

export class PublishCommand extends PublishImageCommand {
  rootProject: string = 'base-images'
  project: string = 'evidnet/ohdsi-stack'

  getOptions (): Array<OptionModel> {
    return []
  }
}

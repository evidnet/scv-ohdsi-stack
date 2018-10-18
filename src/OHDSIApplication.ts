import { version } from '../package.json'
import { BaseApplication, BaseCommand } from '@evidnet/scv-core'
import { BuildCommand } from './commands/BuildCommand'
import { PublishCommand } from './commands/PublishCommand'

export class OHDSIApplication extends BaseApplication {
  version: string = version
  commands: BaseCommand[] = [
    new BuildCommand(), new PublishCommand()
  ]
}

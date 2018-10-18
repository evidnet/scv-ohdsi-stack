import { OHDSIApplication } from './src/OHDSIApplication'

const app = new OHDSIApplication()
export function start () {
  app.start(true, process.argv)
}

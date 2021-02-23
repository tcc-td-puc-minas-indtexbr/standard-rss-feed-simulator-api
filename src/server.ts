import express from 'express'
import cors from 'cors'
import App from './app'
import crypto from 'crypto'
import serverlessExpress from '@vendia/serverless-express'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'

try {
  console.log('try')
  import * as pack from './package.json'
} catch (e) {
  console.log('catch')
  import * as pack from '../package.json'
}

export interface ProcessEnv {
  [key: string]: string | undefined
}

const APP_NAME: string = pack.name
const APP_VERSION: string = pack.version
// const APP_ARCH_VERSION = 'v1'

if (typeof (process.env.PORT) === 'undefined') {
  process.env.PORT = String(3000)
}

export default class Server {
  public express: express.Application
  private app: App

  public constructor () {
    this.express = express()
    this.app = new App()

    this.middlewares()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
    // this.express.use(morgan('combined'))
  }

  private routes (): void {
    this.express.get('/', (req, res) => {
      console.log('/')
      const jsonBody: any = {
        app: `${APP_NAME}:${APP_VERSION}`,
        orginalSource: 'https://github.com/mbertolacci/lorem-rss'
      }
      return res.json(jsonBody)
    })
    this.express.get('/ping', (req, res) => {
      console.log('/ping')
      return res.json({ message: 'PONG' })
    })

    this.express.get('/alive', (req, res) => {
      console.log('/alive')
      return res.json({ app: "I 'am alive" })
    })

    this.express.get('/feed', (req, res) => {
      console.log('/feed')
      const interval = this.getInterval(req)
      const unit = this.getUnit(req)
      const length = this.getLength(req)

      this.app.validate(interval, unit, length)
      const etagString = this.app.generateEtag(interval, unit)
      const feed = this.app.generateFeed(interval, unit, length)
      const xml = feed.xml()
      // res.set('Content-Type', 'application/rss+xml')
      res.set('Content-Type', 'application/xml')
      res.set('ETag', `${crypto.createHash('md5').update(etagString).digest('hex')}`)
      res.send(xml)
    })
  }

  private getInterval (req): number {
    let interval = 1
    try {
      if (req.query.interval != null) {
        interval = parseInt(req.query.interval)
      }
    } catch (e) {
      throw new Error('Interval must be an integer')
    }

    return interval
  }

  private getUnit (req):string {
    return req.query.unit || 'minute'
  }

  private getLength (req):number {
    return req.query.length || 10
  }

  static execute () {
    const server = new Server()
    const app = server.express
    return app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
  }

  static lambdaDeprecated (
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    const serverless = serverlessExpress.createServer(app, () => console.log('Lambda: Runing'))
    return serverlessExpress.proxy(serverless, event, context)
  }

  static lambda (
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    return serverlessExpress({ app })
  }

  static lambda3 (
  ) {
    const server = new Server()
    const app = server.express

    return serverlessExpress({ app })
  }
}

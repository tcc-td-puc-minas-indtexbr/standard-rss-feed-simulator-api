import express from 'express'
import cors from 'cors'
import App from './app'
import crypto from 'crypto'
import serverlessExpress from '@vendia/serverless-express'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'

try {
  console.log('try')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  import * as pack from './package.json'
} catch (e) {
  console.log('catch')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  import * as pack from '../package.json'
}

export interface ProcessEnv {
  [key: string]: string | undefined
}

// eslint-disable-next-line no-undef
const APP_NAME: string = pack.name
// eslint-disable-next-line no-undef
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
    const API_ROOT = process.env.API_ROOT || ''
    this.express.get(API_ROOT + '/', (req, res) => {
      const jsonBody: any = {
        app: `${APP_NAME}:${APP_VERSION}`,
        orginalSource: 'https://github.com/mbertolacci/lorem-rss'
      }
      return res.json(jsonBody)
    })
    this.express.get(API_ROOT + '/ping', (req, res) => {
      return res.json({ message: 'PONG' })
    })

    this.express.get(API_ROOT + '/alive', (req, res) => {
      return res.json({ app: "I 'am alive" })
    })

    this.express.get(API_ROOT + '/feed', (req, res) => {
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

  static lambda (
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const serverless = serverlessExpress.createServer(app)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return serverlessExpress.proxy(serverless, event, context)
  }

  static lambdaV2 (
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    return serverlessExpress({ app })
  }
}

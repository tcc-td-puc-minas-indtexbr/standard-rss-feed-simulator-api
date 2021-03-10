import express from 'express'
import cors from 'cors'
import App from './app'
import crypto from 'crypto'
import serverlessExpress from '@vendia/serverless-express'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import routes from './routes'

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
  process.env.PORT = String(8888) // Porta mais segura
}

if (typeof (process.env.APP_HOST) === 'undefined') {
  process.env.APP_HOST = 'http://localhost:8888'
}

if (typeof (process.env.API_ROOT) === 'undefined') {
  process.env.API_ROOT = ''
}

// const defaultVars = {
//   host: process.env.APP_HOST,
//   root: process.env.API_ROOT
// }

export default class Server {
  public static APP_NAME: string = APP_NAME
  public static APP_VERSION: string = APP_VERSION
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    routes(this.express, this.app)
  }

  static logRoutes (app) {
    app._router.stack.forEach(function (r) {
      if (r.route && r.route.path) {
        console.log(r.route.stack[0].method.toUpperCase(), r.route.path)
      }
    })
  }

  static execute () {
    const server = new Server()
    const app = server.express

    Server.logRoutes(app)

    return app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
  }

  static lambda (
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    Server.logRoutes(app)

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

    Server.logRoutes(app)

    return serverlessExpress({ app })
  }

  public static applyVars(xml: any, variables: any) {
    let xmlStr = xml.toString()
    if (variables) {
      for (let key in variables) {
        // Importante  para evitar o erro:
        // [Object: null prototype] {}
        // TypeError: Cannot convert object to primitive value
        if (key == "_locals") {
          continue
        }

        let regex = new RegExp(`#{${key}}`, 'g')
        try {
          if (variables.hasOwnProperty(key)) {
            xmlStr = xmlStr.replace(regex, variables[key] || '')
          }
        } catch (e) {
          console.error(e)
        }

      }
    }

    return xmlStr
  }
}

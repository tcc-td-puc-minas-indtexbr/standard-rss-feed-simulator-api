"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _packagejson = require('../package.json'); var pack = _interopRequireWildcard(_packagejson);
var _app = require('./app'); var _app2 = _interopRequireDefault(_app);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _awsserverlessexpress = require('aws-serverless-express'); var _awsserverlessexpress2 = _interopRequireDefault(_awsserverlessexpress);






const APP_NAME = pack.name
const APP_VERSION = pack.version
// const APP_ARCH_VERSION = 'v1'

if (typeof (process.env.PORT) === 'undefined') {
  process.env.PORT = String(3000)
}

 class Server {
  
  

   constructor () {
    this.express = _express2.default.call(void 0, )
    this.app = new (0, _app2.default)()

    this.middlewares()
    this.routes()
  }

   middlewares () {
    this.express.use(_express2.default.json())
    this.express.use(_cors2.default.call(void 0, ))
    // this.express.use(morgan('combined'))
  }

   routes () {
    this.express.get('/', (req, res) => {
      const jsonBody = {
        app: `${APP_NAME}:${APP_VERSION}`,
        orginalSource: 'https://github.com/mbertolacci/lorem-rss'
      }
      return res.json(jsonBody)
    })
    this.express.get('/ping', (req, res) => {
      return res.json({ message: 'PONG' })
    })

    this.express.get('/alive', (req, res) => {
      return res.json({ app: "I 'am alive" })
    })

    this.express.get('/feed', (req, res) => {
      const interval = this.getInterval(req)
      const unit = this.getUnit(req)
      const length = this.getLength(req)

      this.app.validate(interval, unit, length)
      const etagString = this.app.generateEtag(interval, unit)
      const feed = this.app.generateFeed(interval, unit, length)
      const xml = feed.xml()
      // res.set('Content-Type', 'application/rss+xml')
      res.set('Content-Type', 'application/xml')
      res.set('ETag', `${_crypto2.default.createHash('md5').update(etagString).digest('hex')}`)
      res.send(xml)
    })
  }

   getInterval (req) {
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

   getUnit (req) {
    return req.query.unit || 'minute'
  }

   getLength (req) {
    return req.query.length || 10
  }

  static execute () {
    const server = new Server()
    const app = server.express
    return app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
  }

  static lambda (
    event,
    context
  ) {
    const server = new Server()
    const app = server.express

    const serverless = _awsserverlessexpress2.default.createServer(app, () => console.log('Lambda: Runing'))
    return _awsserverlessexpress2.default.proxy(serverless, event, context, 'PROMISE')
  }
} exports.default = Server;

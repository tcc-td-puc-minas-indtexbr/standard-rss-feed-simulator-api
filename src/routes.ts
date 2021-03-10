import { Express } from 'express'

import process from 'process'
import crypto from 'crypto'
import Server from './server'
import App from "./app";

function getInterval (req): number {
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

function getUnit (req):string {
  return req.query.unit || 'minute'
}

function getLength (req):number {
  return req.query.length || 10
}

export default function routes (app: Express, serverApp: App) {
  // Importante que esteja no escopo para evitar o erro:
  // [Object: null prototype] {}
  // TypeError: Cannot convert object to primitive value
  // const defaultVars = {
  //   host: process.env.APP_HOST,
  //   root: process.env.API_ROOT
  // }

  const API_ROOT = process.env.API_ROOT || ''
  app.get(API_ROOT + '/', (req, res) => {
    const jsonBody: any = {
      app: `${Server.APP_NAME}:${Server.APP_VERSION}`,
      orginalSource: 'https://github.com/mbertolacci/lorem-rss'
    }
    return res.json(jsonBody)
  })
  app.get(API_ROOT + '/ping', (req, res) => {
    return res.json({ message: 'PONG' })
  })

  app.get(API_ROOT + '/alive', (req, res) => {
    return res.json({ app: "I 'am alive" })
  })

  app.get(API_ROOT + '/feed', (req, res) => {
    const interval = getInterval(req)
    const unit = getUnit(req)
    const length = getLength(req)

    serverApp.validate(interval, unit, length)
    const etagString = serverApp.generateEtag(interval, unit)
    const feed = serverApp.generateFeed(interval, unit, length)
    const xml = feed.xml()
    // res.set('Content-Type', 'application/rss+xml')
    res.set('Content-Type', 'application/xml')
    res.set('ETag', `${crypto.createHash('md5').update(etagString).digest('hex')}`)
    res.send(xml)
  })
}

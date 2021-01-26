"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _rss = require('rss'); var _rss2 = _interopRequireDefault(_rss);
var _moment = require('moment'); var _moment2 = _interopRequireDefault(_moment);
var _randomseed = require('random-seed'); var _randomseed2 = _interopRequireDefault(_randomseed);
const rand = _randomseed2.default.create()

const between = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

 class Iso {constructor() { Iso.prototype.__init.call(this); }
  
  // https://blog.previnsa.com.br/certificacoes-de-qualidade-iso-conheca-os-4-tipos-principais/
   __init() {this.isoCodes = [
    9000, 9001, 9004, 14000, 14001, 14004, 14010, 14031, 14020, 14040, 17025, 19011, 50001
  ]}

   generateIdentification () {
    const year = between(1980, _moment2.default.call(void 0, ).year())
    const iso = this.isoCodes[rand(this.isoCodes.length)]
    return `ISO ${iso}:${year}`
  }

   generateFeed (pubDate, interval, unit, length) {
    // http://www.iso.org/cms/render/live/en/sites/isoorg/contents/shared/rss/latest-standards.rss
    this.rss = new (0, _rss2.default)({
      title: 'ISO standards and projects',
      description: 'ISO standards and projects',
      site_url: '/feed',
      ttl: Math.ceil(_moment2.default.duration(interval, unit).asMinutes()),
      pubDate: pubDate.clone().toDate(),
      generator: 'ISO.org'
    })

    pubDate = this.generateItems(length, pubDate, interval, unit);

    return this.rss
  }

   generateItems(length, pubDate, interval, unit) {
    for (let i = 0; i < length; i++) {
      const identification = this.generateIdentification()
      this.rss.item({
        title: `${identification} - Determination of the silanol group content on the surface of fumed silica — Reaction gas chromatographic method`,
        description: 'This document reached stage 40.20 on 2021-01-26, TC/SC: ISO/TC 256, ICS: 87.060.10',
        url: 'http://www.iso.org/cms/render/live/en/sites/isoorg/contents/data/standard/07/47/74764.html',
        guid: 'http://www.iso.org/cms/render/live/en/sites/isoorg/contents/data/standard/07/47/74764.html',
        pubDate: pubDate.clone().toDate()
      })
      // gera um tempo diff para o proximo item
      pubDate = pubDate.subtract(interval, unit)
    }
    return pubDate;
  }
} exports.default = Iso;

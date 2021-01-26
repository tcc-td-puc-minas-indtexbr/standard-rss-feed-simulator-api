"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _moment = require('moment'); var _moment2 = _interopRequireDefault(_moment);
var _lodash = require('lodash'); var _lodash2 = _interopRequireDefault(_lodash);
var _iso = require('./iso'); var _iso2 = _interopRequireDefault(_iso);

const units = {
  second: {
    nextUp: 'minute',
    mustDivide: 60
  },
  minute: {
    nextUp: 'hour',
    mustDivide: 60
  },
  hour: {
    nextUp: 'day',
    mustDivide: 24
  },
  day: {
    nextUp: 'year',
    mustDivide: 1
  },
  month: {
    nextUp: 'year',
    mustDivide: 12
  },
  year: {
    mustDivide: 1
  }
}

 class App {
  

   static getUnits () {
    return units
  }

   getNearest (interval, unit) {
    let now, returnDate, unitOptions
    if (interval === 1) {
      return _moment2.default.call(void 0, ).utc().startOf(unit)
    } else {
      unitOptions = units[unit]
      if (unitOptions.mustDivide % interval !== 0) {
        throw new Error(`When using ${unit}s the interval must divide ${unitOptions.mustDivide}`)
      }
      now = _moment2.default.call(void 0, ).utc()
      returnDate = now.clone().startOf(unitOptions.nextUp || unit)
      returnDate[unit](now[unit]() - now[unit]() % interval)
      return returnDate
    }
  }

   validate (interval, unit, length) {
    const units = App.getUnits()
    if (interval <= 0) {
      throw new Error('Interval must be greater than 0')
    }
    if (!units[unit]) {
      throw new Error(`Unit must be one of ${_lodash2.default.keys(units).join(', ')}`)
    }

    if (length < 0 || length > 1000) {
      throw new Error('Length must be greater or equal to 0 and smaller or equal to 1000')
    }
  }

  generateFeed (interval, unit, length) {
    this.iso = new (0, _iso2.default)()
    const pubDate = this.getNearest(interval, unit)
    return this.iso.generateFeed(pubDate, interval, unit, length)
  }

  generateEtag(interval, unit) {
    const pubDate = this.getNearest(interval, unit)
    return pubDate + interval + unit
  }

} exports.default = App;

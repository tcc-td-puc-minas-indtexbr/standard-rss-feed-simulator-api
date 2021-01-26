import moment, { unitOfTime } from 'moment'
import _ from 'lodash'
import Iso from './iso'

const units:any = {
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

export default class App {
  iso: Iso

  public static getUnits (): any {
    return units
  }

  public getNearest (interval: number, unit:string) {
    let now, returnDate, unitOptions
    if (interval === 1) {
      return moment().utc().startOf(<unitOfTime.Base>unit)
    } else {
      unitOptions = units[unit]
      if (unitOptions.mustDivide % interval !== 0) {
        throw new Error(`When using ${unit}s the interval must divide ${unitOptions.mustDivide}`)
      }
      now = moment().utc()
      returnDate = now.clone().startOf(unitOptions.nextUp || unit)
      returnDate[unit](now[unit]() - now[unit]() % interval)
      return returnDate
    }
  }

  public validate (interval: number, unit:string, length:number): void {
    const units = App.getUnits()
    if (interval <= 0) {
      throw new Error('Interval must be greater than 0')
    }
    if (!units[unit]) {
      throw new Error(`Unit must be one of ${_.keys(units).join(', ')}`)
    }

    if (length < 0 || length > 1000) {
      throw new Error('Length must be greater or equal to 0 and smaller or equal to 1000')
    }
  }

  generateFeed (interval: number, unit: string, length: number) {
    this.iso = new Iso()
    const pubDate = this.getNearest(interval, unit)
    return this.iso.generateFeed(pubDate, interval, unit, length)
  }

  generateEtag (interval: number, unit: string):string {
    const pubDate = this.getNearest(interval, unit)
    return pubDate + interval + unit
  }
}

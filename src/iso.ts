import RSS from 'rss'
import moment, { unitOfTime } from 'moment'
import randseed from 'random-seed'
const rand = randseed.create()

const between = (min:number, max:number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class Iso {
  public rss: RSS
  // https://blog.previnsa.com.br/certificacoes-de-qualidade-iso-conheca-os-4-tipos-principais/
  public isoCodes = [
    9000, 9001, 9004, 14000, 14001, 14004, 14010, 14031, 14020, 14040, 17025, 19011, 50001
  ]

  public generateIdentification () {
    const year = between(1980, moment().year())
    const iso = this.isoCodes[rand(this.isoCodes.length)]
    return `ISO ${iso}:${year}`
  }

  public generateFeed (pubDate: any, interval: number, unit: string, length: number) {
    // http://www.iso.org/cms/render/live/en/sites/isoorg/contents/shared/rss/latest-standards.rss
    this.rss = new RSS({
      title: 'ISO standards and projects',
      description: 'ISO standards and projects',
      site_url: '/feed',
      ttl: Math.ceil(moment.duration(interval, <unitOfTime.Base>unit).asMinutes()),
      pubDate: pubDate.clone().toDate(),
      generator: 'ISO.org'
    })

    pubDate = this.generateItems(length, pubDate, interval, unit);

    return this.rss
  }

  private generateItems(length: number, pubDate: any, interval: number, unit: string) {
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
}

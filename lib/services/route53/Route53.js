'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSService = require(primitivesPath).AWSService
const Zone = require('./Zone')

class Route53 extends AWSService {
  createZone () {
    const { params, callback } = Route53.getArgs(arguments)

    return this.createHostedZone(params, callback).then(({ HostedZone }) => {
      return Promise.resolve(new Zone(HostedZone, this))
    })
  }

  deleteZone () {
    const { params, callback } = Route53.getArgs(arguments)

    return this.deleteHostedZone(params, callback)
  }

  getZoneCount () {
    const { params, callback } = Route53.getArgs(arguments)

    return this.getHostedZoneCount(params, callback).then(({ HostedZoneCount }) => {
      return Promise.resolve(HostedZoneCount)
    })
  }

  getZones () {
    const { params, callback } = Route53.getArgs(arguments)

    return this.listHostedZones(params, callback).then(({ HostedZones = [] }) => {
      return Promise.resolve(HostedZones.map(z => new Zone(z, this)))
    })
  }

  getZoneByName () {
    const { name, params, callback } = Route53.getArgs(arguments, {
      'string': 'name'
    })

    return this.listHostedZones(params, callback).then(({ HostedZones = [] }) => {
      const filtered = HostedZones.filter(zone => zone.Name.includes(name.trim()))

      return Promise.resolve(filtered.map(z => new Zone(z, this)))
    })
  }

  supportedMethods () {
    return [
      {
        method: 'createHostedZone',
        required: [
          'Name',
          'CallerReference'
        ]
      },
      {
        method: 'deleteHostedZone',
        required: [
          'Id'
        ]
      },
      {
        method: 'listHostedZones'
      },
      {
        method: 'listHostedZonesByName'
      },
      {
        method: 'getHostedZone'
      },
      {
        method: 'getHostedZoneCount'
      },
      {
        method: 'getChange'
      }
    ]
  }

  static get Zone () {
    return Zone
  }
}

module.exports = Route53

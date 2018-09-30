'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource
const RecordSet = require('./RecordSet')

class Zone extends AWSResource {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      HostedZoneId: this.Id
    })
  }

  getRecordSets () {
    const { params, callback } = Zone.getArgs(arguments)

    return this.listResourceRecordSets(params, callback).then(({ ResourceRecordSets = [] }) => {
      return Promise.resolve(ResourceRecordSets.map(rs => new RecordSet(rs, this)))
    })
  }

  newRecordSet () {
    const { params } = Zone.getArgs(arguments)

    return new RecordSet(params, this)
  }

  delete () {
    const { callback } = Zone.getArgs(arguments)

    return this.service.deleteZone({
      Id: this.Id
    }, callback)
  }

  supportedMethods () {
    return [
      {
        method: 'listResourceRecordSets'
      },
      {
        method: 'changeResourceRecordSets',
        required: [
          'ChangeBatch'
        ]
      }
    ]
  }

  static get RecordSet () {
    return Record
  }
}

module.exports = Zone

'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource
const ChangeBatch = require('./ChangeBatch')

class RecordSet extends AWSResource {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      HostedZoneId: this.parent.Id
    })
  }

  getChange (action) {
    return {
      Action: action,
      ResourceRecordSet: this.properties
    }
  }

  create () {
    const { callback } = RecordSet.getArgs(arguments)

    return this.change('CREATE', callback)
  }

  upsert () {
    const { callback } = RecordSet.getArgs(arguments)

    return this.change('UPSERT', callback)
  }

  delete () {
    const { callback } = RecordSet.getArgs(arguments)

    return this.change('DELETE', callback)
  }

  change () {
    const { action, callback } = RecordSet.getArgs(arguments, {
      'string': 'action'
    })

    const params = {
      ChangeBatch: {
        Changes: [
          this.getChange(action)
        ]
      }
    }

    return this.changeResourceRecordSets(params).then(({ ChangeInfo }) => {
      const batch = new ChangeBatch(ChangeInfo, this.service)

      return batch.wait(callback)
    })
  }

  supportedMethods () {
    return [
      {
        method: 'changeResourceRecordSets',
        required: [
          'ChangeBatch'
        ]
      }
    ]
  }

  static get ChangeBatch () {
    return ChangeBatch
  }
}

module.exports = RecordSet

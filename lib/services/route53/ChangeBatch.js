'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource

class ChangeBatch extends AWSResource {
  constructor() {
    super(...arguments)

    this.setDefaultParams({
      Id: this.Id
    })

    this.timeout = 3600000
    this.elapsed = 0
    this.interval = 30000
  }

  wait() {
    const {
      params,
      callback
    } = ChangeBatch.getArgs(arguments)

    return this.getChange(params, callback).then(({ ChangeInfo }) => {
      if (!ChangeInfo) {
        ChangeBatch.error('Missing ChangeInfo from getChange()!')
      }

      this.setProperties(ChangeInfo, false)

      if (this.Status === 'PENDING') {
        ChangeBatch.debug('Waiting for pending change:', this.Id)

        if (this.elapsed <= this.timeout) {
          setTimeout(() => {
            this.elapsed += this.interval
            this.wait(params, callback)
          }, this.interval)
        } else {
          ChangeBatch.error(`ChangeBatch timed out! timeout = ${this.timeout}ms, interval = ${this.interval}`)
        }
      } else {
        ChangeBatch.debug('Done waiting for change:', this.Id)
        ChangeBatch.debug('Status is:', this.Status)

        if (this.Status === 'INSYNC') {
          return callback()
        } else {
          ChangeBatch.error(`Unexpected ChangeBatch status while waiting: "${this.Status}"`)
        }
      }
    })
  }

  supportedMethods() {
    return [{
      method: 'getChange'
    }]
  }
}

module.exports = ChangeBatch
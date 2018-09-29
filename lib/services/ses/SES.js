'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSService = require(primitivesPath).AWSService
const Email = require('./Email')

class SES extends AWSService {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      // Default SES parameters
    })
  }

  newEmail () {
    const { params } = SES.getArgs(arguments)

    return new Email(params, this)
  }

  supportedMethods () {
    return []
  }

  static get Email () {
    return Email
  }
}

module.exports = SES

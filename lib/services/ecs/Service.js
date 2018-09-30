'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource
const Task = require('./Task')

class Service extends AWSResource {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      serviceName: this.serviceName
    })
  }

  getTasks () {
    const { params, callback } = Service.getArgs(arguments)

    return this.parent.getTasks(Object.assign({}, { serviceName: this.serviceName }, params), callback)
  }

  supportedMethods () {
    return [

    ]
  }

  static get Task () {
    return Task
  }
}

module.exports = Service

'use strict'

const Utility = require('./Utility')

class Dynamic extends Utility {
  constructor () {
    super()

    const { name } = Dynamic.getArgs(arguments, {
      'string': 'name'
    })

    this.name = name || this.constructor.name
    this.defaultParams = {}
  }

  setDefaultParams () {
    const { params } = Dynamic.getArgs(arguments)

    Dynamic.debug('Setting default params:', params)

    this.defaultParams = Object.assign({}, this.defaultParams, params)
  }

  buildMethods () {
    let service = this

    if (this.service) {
      service = this.service
    }

    this.supportedMethods().forEach(methodConfig => {
      Dynamic.requireParams(methodConfig, ['method'])

      const { method, params, required } = Dynamic.getArgs(methodConfig)

      const autoParams = Object.assign({}, params)

      Dynamic.debug(`Building method '${method}' for '${this.name}`, autoParams)

      if (service.hasMethod(method)) {
        this[method] = (...args) => {
          const { params, callback } = Dynamic.getArgs(args)

          const compiledParams = Object.assign({}, this.defaultParams, autoParams, params)

          Dynamic.debug(`Calling generic execution for method '${method}' with params:`, compiledParams)

          return service.generic(method, compiledParams, callback, required)
        }
      } else {
        Dynamic.warn(`Invalid method '${method}' for this ${this.name}`)
      }
    })
  }

  supportedMethods () {
    return []
  }
}

module.exports = Dynamic

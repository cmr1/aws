'use strict'

const AWSService = require('./AWSService')
const Dynamic = require('./Dynamic')

class AWSResource extends Dynamic {
  constructor () {
    super(...arguments)

    const { service, resource, properties } = AWSResource.getArgs(arguments, {
      'object': (obj) => {
        if (obj instanceof AWSService) {
          return 'service'
        } else if (obj instanceof AWSResource) {
          return 'resource'
        }

        return 'properties'
      }
    })

    if (resource) {
      this.defaultParams = Object.assign({}, this.defaultParams, resource.defaultParams)
    }

    this.parent = resource || service

    this.service = service || resource.service

    if (!this.service) {
      AWSResource.error(`Missing service for resource: ${this.name}!`)
    }

    AWSResource.debug(`Creating AWS ${this.name} resource for ${this.service.name} service`)

    this.setProperties(properties)

    const nameAlias = `${this.constructor.name.toLowerCase()}Name`

    if (typeof this[nameAlias] === 'string') {
      this.name = this[nameAlias]
    }

    this.buildMethods()
  }

  setProperties (properties, safe = true) {
    if (typeof properties === 'object') {
      this.properties = Object.assign({}, properties)

      Object.keys(this.properties).forEach(key => {
        if (safe && typeof this[key] !== 'undefined') {
          AWSResource.error(`Conflicting property key: '${key}'`)
        }

        this[key] = this.properties[key]
      })
    }
  }
}

module.exports = AWSResource

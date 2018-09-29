'use strict'

const async = require('async')
const AWS = require('aws-sdk')
const Dynamic = require('./Dynamic')

class AWSService extends Dynamic {
  constructor () {
    super(...arguments)

    this.autoPaginate = true

    AWSService.debug(`Creating AWS ${this.name} service`)

    let awsArgs = {}

    const { params } = AWSService.getArgs(arguments)

    if (params) {
      awsArgs = params
    }

    if (!awsArgs.region) {
      if (process.env.AWS_DEFAULT_REGION) {
        awsArgs.region = process.env.AWS_DEFAULT_REGION
      } else if (process.env.AWS_REGION) {
        awsArgs.region = process.env.AWS_REGION
      } else {
        AWSService.debug(`Unable to set region for service: ${this.name}`)
      }
    }

    this.handler = (typeof AWS[this.name] === 'function') ? new AWS[this.name](awsArgs) : null

    this.buildMethods()
  }

  hasMethod (method) {
    return typeof method === 'string' && typeof this.handler[method] === 'function'
  }

  reduceResponses (responses = []) {
    if (!Array.isArray(responses)) {
      AWSService.error('Can only reduce Arrays!')
    }

    AWSService.debug('Reducing ' + responses.length + ' responses')

    if (responses.length === 1) {
      AWSService.debug('Returning single response')
      return responses[0]
    } else if (responses.length > 1) {
      AWSService.debug('Collapsing immediate arrays...')

      const template = responses[0]

      for (let i = 1; i < responses.length; i++) {
        const response = responses[i]

        Object.keys(template).forEach(key => {
          if (Array.isArray(template[key]) && Array.isArray(response[key])) {
            template[key] = template[key].concat(response[key])
          }
        })
      }

      return template
    }

    AWSService.warn('Unable to reduce responses!')

    return {}
  }

  generic () {
    const { method, params, callback, required } = AWSService.getArgs(arguments)

    if (required) {
      AWSService.requireParams(params, required)
    }

    if (typeof callback !== 'function') {
      AWSService.warn(`Executing generic method '${method}' without callback!`)
    }

    AWSService.debug('Executing method:', method, 'with params:', params)

    let isFinished = true

    const responses = []

    async.doWhilst(
      (next) => {
        this.exec(method, params).then(data => {
          AWSService.debug('Result:', data)

          responses.push(data)

          isFinished = !this.autoPaginate || (this.autoPaginate && !(data.IsTruncated || data.nextToken))

          if (data.IsTruncated) {
            AWSService.debug('Result is truncated')

            let nextMarker = data.NextMarker

            if (typeof nextMarker !== 'string') {
              nextMarker = data.Contents[data.Contents.length - 1].Key
            }

            AWSService.debug('Load nextMarker:', nextMarker)

            params.Marker = nextMarker
          } else if (data.nextToken) {
            AWSService.debug('Result is truncated')

            AWSService.debug('Load nextToken:', data.nextToken)

            params.nextToken = data.nextToken
          }

          next()
        }).catch(AWSService.error)
      },
      () => {
        return !isFinished
      },
      (err) => {
        if (typeof callback === 'function') {
          callback(this.reduceResponses(responses))
        }
      }
    )
  }

  exec () {
    const { method, params } = AWSService.getArgs(arguments)

    return new Promise((resolve, reject) => {
      if (typeof this.handler[method] !== 'function') {
        reject(`Invalid service method: ${this.name}:${method}`)
      }

      if (typeof params !== 'object') {
        reject('Invalid params')
      }

      this.handler[method](params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

module.exports = AWSService

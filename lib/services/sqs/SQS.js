'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSService = require(primitivesPath).AWSService
const Queue = require('./Queue')

class SQS extends AWSService {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      // Default SQS parameters
    })
  }

  getQueue () {
    const { params, callback } = Queue.getArgs(arguments)

    return this.createQueue(params, data => {
      if (typeof callback === 'function') {
        callback(new Queue(data.QueueUrl, this))
      }
    }).then(({ QueueUrl }) => Promise.resolve(new Queue(QueueUrl, this)))
  }

  supportedMethods () {
    return [
      {
        method: 'getQueueUrl',
        required: [
          'QueueName'
        ]
      },
      {
        method: 'createQueue',
        required: [
          'QueueName'
        ]
      }
    ]
  }

  static get Queue () {
    return Queue
  }
}

module.exports = SQS

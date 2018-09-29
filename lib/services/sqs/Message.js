'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource

class Message extends AWSResource {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      // QueueUrl: this.service.defaultParams.QueueUrl,
      QueueUrl: this.parent.name
      // ReceiptHandle: this.ReceiptHandle,
    })

    this.parseBody()
  }

  parseBody () {
    this.parsed = this.Body

    try {
      this.parsed = JSON.parse(this.Body)
    } catch (e) {
      Message.debug(`Unable to parse body as json: ${this.Body}`)
    }
  }

  send () {
    const { params, callback } = Message.getArgs(arguments)

    Message.debug(`Sending message: ${this.Body}`)

    return this.sendMessage(params, response => {
      this.setProperties(response)

      if (typeof callback === 'function') {
        callback(response)
      }
    }).then((response) => {
      this.setProperties(response)
      return Promise.resolve(response)
    })
  }

  delete () {
    const { params, callback } = Message.getArgs(arguments)

    Message.debug(`Deleting message: ${this.MessageId}`)

    return this.deleteMessage(params, callback)
  }

  supportedMethods () {
    return [
      {
        method: 'sendMessage',
        params: {
          MessageBody: this.Body
        },
        required: [
          'QueueUrl',
          'MessageBody'
        ]
      },
      {
        method: 'deleteMessage',
        params: {
          ReceiptHandle: this.ReceiptHandle
        },
        required: [
          'QueueUrl',
          'ReceiptHandle'
        ]
      }
    ]
  }

  toString () {
    return `[${this.MessageId}] - '${this.Body}'`
  }
}

module.exports = Message

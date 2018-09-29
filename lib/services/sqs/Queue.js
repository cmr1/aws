'use strict'

const path = require('path')
const async = require('async')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource
const Message = require('./Message')

const DEFAULT_CONCURRENCY = 1

class Queue extends AWSResource {
  constructor () {
    super(...arguments)

    this.concurrency = this.concurrency || DEFAULT_CONCURRENCY

    this.setDefaultParams({
      QueueUrl: this.name
    })
  }

  sendMessage () {
    const { bodyString, bodyObject, callback } = Queue.getArgs(arguments, {
      'string': 'bodyString',
      'object': 'bodyObject'
    })

    if (bodyString && bodyObject) {
      Queue.error('Provide only one body source! (string or object, both were provided)')
    }

    const newMessage = this.newMessage({
      Body: bodyObject ? JSON.stringify(bodyObject) : bodyString
    })

    return newMessage.send(callback)
  }

  newMessage () {
    const { params } = Queue.getArgs(arguments)

    return new Message(params, this)
  }

  delete () {
    const { params, callback } = Queue.getArgs(arguments)

    return this.deleteQueue(params, callback)
  }

  listen () {
    const { params, callback } = Queue.getArgs(arguments)

    Queue.debug(`Listening to queue url: `, this.defaultParams)

    return this.receiveMessage(params, data => {
      const { Messages = [] } = data

      if (typeof callback === 'function') {
        callback(Messages.map(msg => new Message(msg, this)))
      }
    }).then(({ Messages = [] }) =>
      Promise.resolve(
        Messages.map(msg => new Message(msg, this))
      )
    )
  }

  async poll() {
    const { callback } = Queue.getArgs(arguments)

    const workers = async.queue(callback, this.concurrency)

    workers.empty = async () => await this.pol(...arguments)

    const msgs = await this.listen()

    if (msgs.length > 0) {
      workers.push(msgs, callback)

    } else {
      await this.poll(...arguments)
    }
  }

  supportedMethods () {
    return [
      {
        method: 'receiveMessage',
        required: [
          'QueueUrl'
        ]
      },
      {
        method: 'deleteQueue',
        required: [
          'QueueUrl'
        ]
      }
    ]
  }

  static get Message () {
    return Message
  }
}

module.exports = Queue

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
    const { params = {}, callback, concurrency } = Queue.getArgs(arguments, {
      'number': 'concurrency'
    })

    const limit = concurrency || params.MaxNumberOfMessages || DEFAULT_CONCURRENCY

    Queue.log(`Polling for messages on Queue: ${this.name} ...`)

    const workers = async.queue(callback, limit)

    const debugQueueStatus = () => {
      const l = workers.length()
      const s = workers.started
      const r = workers.running()
      const i = workers.idle()
      const c = workers.concurrency

      let state = 'unknown'

      if (s) state = 'started'
      if (i) state = 'idle'

      const msg = `${this.name} Workers: LIMIT=${c} | SIZE=${l} | STATE=${state} | RUNNING=${r}`

      Queue.log(msg)
    }

    setInterval(debugQueueStatus, 1000)

    const receiveMessages = async () => {
      const msgs = await this.listen(params)

      Queue.debug(`${this.name}: Received ${msgs.length} message(s)`)

      if (msgs.length > 0) {
        workers.push(msgs, err => {
          if (err) {
            Queue.warn(err)
          }
        })
      } else {
        receiveMessages()
      }
    }

    receiveMessages()

    workers.unsaturated = receiveMessages
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

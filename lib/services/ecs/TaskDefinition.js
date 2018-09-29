'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource

const Task = require('./Task')

class TaskDefinition extends AWSResource {
  constructor () {
    super(...arguments)

    this.autoPaginate = false

    this.setDefaultParams({
      taskDefinition: this.taskDefinitionArn
    })
  }

  run () {
    const { params, callback } = TaskDefinition.getArgs(arguments)

    this.runTask(params, response => {
      if (response.tasks) {
        return callback(response.tasks.map(t => { return new this.constructor.Task(t, this) }))
      } else {
        return callback()
      }
    })
  }

  delete () {
    const { params, callback } = TaskDefinition.getArgs(arguments)

    this.deregisterTaskDefinition(params, response => {
      if (response.taskDefinition) {
        return callback(this)
      } else {
        return callback()
      }
    })
  }

  supportedMethods () {
    return [
      {
        method: 'runTask',
        required: [
          'cluster',
          'taskDefinition'
        ]
      },
      {
        method: 'deregisterTaskDefinition',
        required: [
          'taskDefinition'
        ]
      }
    ]
  }

  static get Task () {
    return require('./Task')
  }
}

module.exports = TaskDefinition

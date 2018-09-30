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

    return this.runTask(params, callback).then(({ tasks = [] }) => {
      return Promise.resolve(tasks.map(t => new Task(t, this)))
    })
  }

  delete () {
    const { params, callback } = TaskDefinition.getArgs(arguments)

    return this.deregisterTaskDefinition(params, callback)
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

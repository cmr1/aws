'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource
const TaskDefinition = require('./TaskDefinition')

class Task extends AWSResource {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      task: this.taskArn
    })
  }

  getDefinition () {
    const { params } = Task.getArgs(arguments)

    const describeParams = Object.assign({}, { taskDefinition: this.taskDefinitionArn }, params)

    return this.service.describeTaskDefinition(describeParams).then(({ taskDefinition }) => {
      return Promise.resolve(new TaskDefinition(taskDefinition, this))
    })
  }

  stop () {
    const { params, callback } = Task.getArgs(arguments)

    return this.stopTask(params, callback)
  }

  supportedMethods () {
    return [
      {
        method: 'stopTask',
        required: [
          'task',
          'cluster'
        ]
      }
    ]
  }

  static get TaskDefinition () {
    return TaskDefinition
  }
}

module.exports = Task

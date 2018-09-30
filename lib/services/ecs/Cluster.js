'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSResource = require(primitivesPath).AWSResource
const Task = require('./Task')
const TaskDefinition = require('./TaskDefinition')
const Service = require('./Service')
const ContainerInstance = require('./ContainerInstance')

class Cluster extends AWSResource {
  constructor () {
    super(...arguments)

    this.setDefaultParams({
      cluster: this.clusterName
    })
  }

  delete () {
    const { params, callback } = Cluster.getArgs(arguments)

    return this.deleteCluster(params, callback)
  }

  newService () {
    const { params, callback } = Cluster.getArgs(arguments)

    return this.createService(params, callback).then(({ service }) => {
      return Promise.resolve(new Service(response.service, this))
    })
  }

  runTaskDefinition () {
    const { taskDefinition, callback } = Cluster.getArgs(arguments, {
      'object': 'taskDefinition'
    })

    if (taskDefinition instanceof TaskDefinition) {
      return taskDefinition.run({ cluster: this.clusterName })
    } else {
      return Promise.reject(new Error('Invalid task definition'))
    }
  }

  getTasks () {
    const { params, callback } = Cluster.getArgs(arguments)

    return this.listTasks(params, callback).then(({ taskArns = [] }) => {
      if (taskArns.length > 0) {
        return this.describeTasks({ tasks: taskArns }).then(({ tasks = [] }) => {
          return Promise.resolve(tasks.map(t => new Task(t, this)))
        })
      } else {
        return Promise.resolve([])
      }
    })
  }

  getServices () {
    const { params, callback } = Cluster.getArgs(arguments)

    return this.listServices(params, callback).then(({ serviceArns = [] }) => {
      if (serviceArns.length > 0) {
        return this.describeServices({ services: serviceArns }).then(({ services = [] }) => {
          return Promise.resolve(services.map(s => new Service(s, this)))
        })
      } else {
        return Promise.resolve([])
      }
    })
  }

  getContainerInstances () {
    const { params, callback } = Cluster.getArgs(arguments)

    return this.listContainerInstances(params, callback).then(({ containerInstanceArns = [] }) => {
      if (containerInstanceArns.length > 0) {
        return this.describeContainerInstances({ containerInstances: containerInstanceArns }).then(({ containerInstances = [] }) => {
          return Promise.resolve(containerInstances.map(ci => new ContainerInstance(ci, this)))
        })
      } else {
        return Promise.resolve([])
      }
    })
  }

  supportedMethods () {
    return [
      {
        method: 'deleteCluster',
        required: [
          'cluster'
        ]
      },
      {
        method: 'createService',
        required: [
          'desiredCount',
          'serviceName',
          'taskDefinition'
        ]
      },
      {
        method: 'listTasks',
        required: [
          'cluster'
        ]
      },
      {
        method: 'describeTasks',
        required: [
          'cluster',
          'tasks'
        ]
      },
      {
        method: 'listServices',
        required: [
          'cluster'
        ]
      },
      {
        method: 'describeServices',
        required: [
          'cluster',
          'services'
        ]
      },
      {
        method: 'listContainerInstances',
        required: [
          'cluster'
        ]
      },
      {
        method: 'describeContainerInstances',
        required: [
          'cluster',
          'containerInstances'
        ]
      }
    ]
  }

  static get Task () {
    return Task
  }

  static get Service () {
    return Service
  }

  static get ContainerInstance () {
    return ContainerInstance
  }
}

module.exports = Cluster

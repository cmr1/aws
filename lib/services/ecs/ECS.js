'use strict'

const path = require('path')
const async = require('async')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSService = require(primitivesPath).AWSService
const Cluster = require('./Cluster')
const TaskDefinition = require('./TaskDefinition')

class ECS extends AWSService {
  constructor () {
    super(...arguments)

    this.autoPaginate = false
  }

  newCluster () {
    const { params, callback } = ECS.getArgs(arguments)

    return this.createCluster(params, callback).then(({ cluster }) => {
      return Promise.resolve(new Cluster(cluster, this))
    })
  }

  newTaskDefinition () {
    const { params, callback } = ECS.getArgs(arguments)

    return this.registerTaskDefinition(params, callback).then(({ taskDefinition }) => {
      return Promise.resolve(new TaskDefinition(taskDefinition, this))
    })
  }

  getClusters () {
    const { params, callback } = ECS.getArgs(arguments)

    return this.listClusters(params, callback).then(({ clusterArns = [] }) => {
      return this.describeClusters({ clusters: clusterArns }).then(({ clusters = [] }) => {
        return Promise.resolve(clusters.map(c => new Cluster(c, this)))
      })
    })
  }

  getTaskDefinitions () {
    const { params, callback } = ECS.getArgs(arguments)

    return this.listTaskDefinitions(params, callback).then(({ taskDefinitionArns = [] }) => {
      return new Promise(
        (resolve, reject) => {
          const taskDefinitions = []

          async.each(taskDefinitionArns, (taskDefinitionArn, next) => {
            this.describeTaskDefinition({ taskDefinition: taskDefinitionArn }).then(({ taskDefinition }) => {
              taskDefinitions.push(new TaskDefinition(taskDefinition, this))
              next()
            })
          }, () => {
            return resolve(taskDefinitions)
          })
        }
      )
    })
  }

  supportedMethods () {
    return [
      {
        method: 'createCluster',
        required: [
          'clusterName'
        ]
      },
      {
        method: 'listClusters'
      },
      {
        method: 'describeClusters',
        required: [
          'clusters'
        ]
      },
      {
        method: 'listTaskDefinitions'
      },
      {
        method: 'describeTaskDefinition',
        required: [
          'taskDefinition'
        ]
      }, {
        method: 'registerTaskDefinition',
        required: [
          'family',
          'containerDefinitions'
        ]
      }
    ]
  }

  static get Cluster () {
    return Cluster
  }

  static get TaskDefinition () {
    return TaskDefinition
  }
}

module.exports = ECS

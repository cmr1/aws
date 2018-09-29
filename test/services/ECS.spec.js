'use strict'

const expect = require('chai').expect

// Require ECS AWSService Class
const { ECS } = require('../../')

describe('ECS', function () {
  const ecs = new ECS()
  const clusterName = 'cmr1-aws-test-' + Date.now().toString()
  let cluster = null

  before(function (done) {
    ecs.newCluster({ clusterName }, objCluster => {
      if (objCluster) {
        cluster = objCluster
        done()
      } else {
        done('Unable to create/load cluster: ' + clusterName)
      }
    })
  })

  after(function (done) {
    cluster.delete(resp => {
      done()
    })
  })

  it('should exist', function () {
    expect(ECS).to.exist
  })

  it('instance has supported methods', function () {
    ecs.supportedMethods().forEach(methodConfig => {
      expect(ecs[methodConfig.method]).to.be.a('function')
    })
  })

  it('should be able to get clusters', function (done) {
    ecs.getClusters(clusters => {
      expect(clusters).to.be.an.instanceof(Array)

      if (clusters.length > 0) {
        expect(clusters[0]).to.be.an.instanceof(ECS.Cluster)
      }

      done()
    })
  })

  it('should be able to get task definitions', function (done) {
    ecs.getTaskDefinitions({ maxResults: 1 }, taskDefinitions => {
      expect(taskDefinitions).to.be.an.instanceof(Array)

      if (taskDefinitions.length > 0) {
        expect(taskDefinitions[0]).to.be.an.instanceof(ECS.TaskDefinition)
      }

      done()
    })
  })

  describe('Cluster', function () {
    it('instance has supported methods', function () {
      cluster.supportedMethods().forEach(methodConfig => {
        expect(cluster[methodConfig.method]).to.be.a('function')
      })
    })

    it('should be able to get a list of container instances', function (done) {
      cluster.getContainerInstances({ maxResults: 1 }, containerInstances => {
        expect(containerInstances).to.be.an.instanceof(Array)

        if (containerInstances.length > 0) {
          expect(containerInstances[0]).to.be.an.instanceof(ECS.Cluster.ContainerInstance)
        }

        done()
      })
    })

    it('should be able to get a list of services', function (done) {
      cluster.getServices({ maxResults: 1 }, services => {
        expect(services).to.be.an.instanceof(Array)

        if (services.length > 0) {
          expect(services[0]).to.be.an.instanceof(ECS.Cluster.Service)
        }

        done()
      })
    })

    it('should be able to get a list of tasks', function (done) {
      cluster.getTasks({ maxResults: 1 }, tasks => {
        expect(tasks).to.be.an.instanceof(Array)

        if (tasks.length > 0) {
          expect(tasks[0]).to.be.an.instanceof(ECS.Cluster.Task)
        }

        done()
      })
    })
  })

  describe('TaskDefinition', function () {
    const taskDefinitionFamily = 'cmr1-aws-test-' + Date.now().toString()
    let taskDefinition = null

    before(function (done) {
      const params = {
        family: taskDefinitionFamily,
        containerDefinitions: [
          {
            name: taskDefinitionFamily,
            image: 'hello-world',
            cpu: 128,
            memory: 128
          }
        ]
      }

      ecs.newTaskDefinition(params, objTaskDefinition => {
        if (objTaskDefinition) {
          taskDefinition = objTaskDefinition
          done()
        } else {
          done('Unable to create/revision task definition: ' + taskDefinitionFamily)
        }
      })
    })

    after(function (done) {
      taskDefinition.delete(resp => {
        done()
      })
    })

    it('instance has supported methods', function () {
      taskDefinition.supportedMethods().forEach(methodConfig => {
        expect(taskDefinition[methodConfig.method]).to.be.a('function')
      })
    })

    // Wait to simulate until EC2 instances are being spun up for cluster...

    // it('should be able to be run by a cluster', function(done) {
    //     cluster.runTaskDefinition(taskDefinition, tasks => {
    //         expect(tasks.length).to.be.greaterThan(0);

    //         expect(tasks[0]).to.be.an.instanceof(ECS.Cluster.Task);
    //     });
    // });
  })
})

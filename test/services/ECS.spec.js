'use strict'

const expect = require('chai').expect

// Require ECS AWSService Class
const { ECS } = require('../../')

describe('ECS', function () {
  const ecs = new ECS()
  const clusterName = 'cmr1-aws-test-' + Date.now().toString()
  let cluster = null

  before(async function () {
    cluster = await ecs.newCluster({ clusterName })
  })

  after(async function () {
    await cluster.delete()
  })

  it('should exist', function () {
    expect(ECS).to.exist
  })

  it('instance has supported methods', function () {
    ecs.supportedMethods().forEach(methodConfig => {
      expect(ecs[methodConfig.method]).to.be.a('function')
    })
  })

  it('should be able to get clusters', async function () {
    const clusters = await ecs.getClusters()

    expect(clusters).to.be.an.instanceof(Array)

    if (clusters.length > 0) {
      expect(clusters[0]).to.be.an.instanceof(ECS.Cluster)
    }
  })

  it('should be able to get task definitions', async function () {
    const taskDefinitions = await ecs.getTaskDefinitions({ maxResults: 1 })

    expect(taskDefinitions).to.be.an.instanceof(Array)

    if (taskDefinitions.length > 0) {
      expect(taskDefinitions[0]).to.be.an.instanceof(ECS.TaskDefinition)
    }
  })

  describe('Cluster', function () {
    it('instance has supported methods', function () {
      cluster.supportedMethods().forEach(methodConfig => {
        expect(cluster[methodConfig.method]).to.be.a('function')
      })
    })

    it('should be able to get a list of container instances', async function () {
      const containerInstances = await cluster.getContainerInstances({ maxResults: 1 })

      expect(containerInstances).to.be.an.instanceof(Array)

      if (containerInstances.length > 0) {
        expect(containerInstances[0]).to.be.an.instanceof(ECS.Cluster.ContainerInstance)
      }
    })

    it('should be able to get a list of services', async function () {
      const services = await cluster.getServices({ maxResults: 1 })

      expect(services).to.be.an.instanceof(Array)

      if (services.length > 0) {
        expect(services[0]).to.be.an.instanceof(ECS.Cluster.Service)
      }
    })

    it('should be able to get a list of tasks', async function () {
      const tasks = await cluster.getTasks({ maxResults: 1 })

      expect(tasks).to.be.an.instanceof(Array)

      if (tasks.length > 0) {
        expect(tasks[0]).to.be.an.instanceof(ECS.Cluster.Task)
      }
    })
  })

  describe('TaskDefinition', function () {
    const taskDefinitionFamily = 'cmr1-aws-test-' + Date.now().toString()
    let taskDefinition = null

    before(async function () {
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

      taskDefinition = await ecs.newTaskDefinition(params)
    })

    after(async function () {
      await taskDefinition.delete()
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

const Cmr1Aws = require('../../')
const ecs = new Cmr1Aws.ECS()

const family = 'example-task'
const cluster = 'example-cluster'
const container = 'app'

const run = async () => {
  const taskDefinitions = await ecs.getTaskDefinitions({
    maxResults: 1,
    familyPrefix: family,
    sort: 'DESC'
  })

  if (taskDefinitions.length === 1) {
    const task = await taskDefinitions[0].run({
      cluster,
      overrides: {
        containerOverrides: [
          {
            name: container,
            environment: [
              {
                name: 'ENV_SAMPLE_VAR',
                value: 'env-sample-value'
              }
            ]
          }
        ]
      }
    })

    console.log(task)
  } else {
    console.log(taskDefinitions)
    throw new Error(`def count was ${taskDefinitions.length}, expected 1`)
  }
}

run()

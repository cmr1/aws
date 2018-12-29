const { SQS, Route53, ECS, ACM } = require('../lib/services')

const sqs = new SQS()

const run = async () => {
  const queue = await sqs.getQueue({ QueueName: 'test-queue' })
  console.log('queue', queue)

  // const msgs = await queue.listen({})

  // console.log('msgs', msgs)

  queue.poll((msg, callback) => {
    const start = Date.now()

    SQS.warn('Processing message', msg)

    const prefix = `[${msg.MessageId}] - `

    const sleep = Math.ceil(Math.random() * 10000)

    SQS.warn(prefix, `Sleeping for ${sleep} ms ...`)

    setTimeout(() => {
      SQS.log(prefix, 'Done sleeping! Deleting message ...')
      msg.delete().then(callback).catch(callback)
    }, sleep)
  })
}

run()
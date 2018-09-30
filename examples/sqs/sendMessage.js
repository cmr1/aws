const { SQS } = require('../../lib/services')

const sqs = new SQS()

const QueueName = 'test-queue'
const MessageCount = 10

const run = async () => {
  const queue = await sqs.getQueue({ QueueName })
  // SQS.log('queue', queue)

  // const msgs = await queue.listen({})

  // console.log('msgs', msgs)

  SQS.log(`Sending ${MessageCount} message(s) to Queue: ${QueueName}`)

  for (let i = 1; i <= MessageCount; i++) {
    const msg = await queue.sendMessage({
      sleep: Math.ceil(Math.random() * 2000)
    })
    SQS.log(`Sent message #${i} - ${msg.MessageId}`)
  }

  SQS.log('Done!')
}

run().catch(err => {
  SQS.warn('Caught error in example run()')
  SQS.error(err)
})

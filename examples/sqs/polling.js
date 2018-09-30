const { SQS } = require('../../lib/services')

const sqs = new SQS()

const run = async () => {
  const queue = await sqs.getQueue({ QueueName: 'test-queue' })

  const params = {
    MaxNumberOfMessages: 10
  }

  queue.poll(100, params, (msg, next) => {
    const start = Date.now()

    SQS.debug('Processing message', msg)

    const prefix = `[${msg.MessageId}]`

    const sleep = msg.parsed.sleep || Math.ceil(Math.random() * 10000)

    // SQS.log(prefix, `Sleeping for ${sleep} ms ...`)

    setTimeout(() => {
      // SQS.log(prefix, `Done sleeping for ${sleep} ms! Deleting message ...`)
      msg.delete().then(() => {
        const end = Date.now()
        const dur = (end - start) / 1000
        // SQS.log(prefix, `Finished in ${dur}s`)
        SQS.debug('Deleted msg:', msg.parsed)
        next()
      }).catch(next)
    }, sleep)
  })
}

run().catch(err => {
  SQS.warn('Caught error in example run()')
  SQS.error(err)
})

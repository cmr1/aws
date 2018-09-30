'use strict'

const expect = require('chai').expect

// Require SQS AWSService Class
const { SQS } = require('../../')

describe('SQS', function () {
  const sqs = new SQS()

  it('should exist', function () {
    expect(SQS).to.exist
  })

  describe('Queue', function () {
    const QueueName = 'cmr1-aws-test-' + Date.now().toString()
    let queue = null

    before(async function () {
      queue = await sqs.getQueue({ QueueName })
    })

    after(async function () {
      await queue.delete()
    })

    it('should be able to send & receive messages', async function () {
      const msgBody = 'This is a test message'

      const myMessage = queue.newMessage({
        Body: msgBody
      })

      await myMessage.send()

      const msgs = await queue.listen({ MaxNumberOfMessages: 1 })

      expect(msgs).to.be.an.instanceof(Array)

      const expected = msgs.filter(msg => {
        return msg.Body === msgBody
      })

      expect(expected).to.have.length.above(0)

      expect(expected[0]).to.be.an.instanceof(SQS.Queue.Message)
      expect(expected[0].toString()).to.match(/\[[^\]]+\] - '.+'/)

      await expected[0].delete()
    })

    // it('should be able to poll for messages', async function () {
    //   const messageCount = Math.ceil(Math.random() * 10)
    //   let sentCount = 0
    //   let receivedCount = 0

    //   queue.poll(async (msg, next) => {
    //     expect(msg).to.be.an.instanceof(SQS.Queue.Message)
    //     expect(msg.parsed).to.be.an('object')
    //     expect(msg.parsed.i).to.be.a('number')
    //     expect(msg.parsed.i).to.be.at.least(0)
    //     expect(msg.parsed.i).to.be.at.most(messageCount - 1)

    //     await msg.delete()

    //     receivedCount++

    //     next()
    //   })

    //   for (let i = 0; i < messageCount; i++) {
    //     const msg = await queue.sendMessage({ i })

    //     expect(msg).to.be.an.instanceof(SQS.Queue.Message)
    //     expect(msg.MessageId).to.be.a('string')

    //     sentCount++
    //   }

    //   expect(sentCount).to.equal(messageCount)
    //   expect(receivedCount).to.equal(messageCount)
    // })
  })
})

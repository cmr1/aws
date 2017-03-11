'use strict';

const expect = require('chai').expect;

// Require SQS AWSService Class
const { SQS } = require('../../');


describe('SQS', function() {
    const sqs = new SQS();

    const queueParams = {
        QueueName: 'cmr1-aws-mocha-test'
    };

    it('should exist', function() {
        expect(SQS).to.exist;
    });

    describe('Queue', function() {
        const queueName = 'cmr1-aws-test-' + Date.now().toString();
        let queue = null;

        before(function(done) {
            sqs.getQueue({ QueueName: queueName }, objQueue => {
                if (objQueue) {
                    queue = objQueue;
                    done();
                } else {
                    done('Unable to create/load queue: ' + queueName);
                }
            });
        });

        after(function(done) {
            queue.delete(resp => {
                done();
            });
        });
        
        it('should be able to send & receive messages', function(done) {
            const msgBody = 'This is a test message';
            
            const myMessage = queue.newMessage({
                Body: msgBody
            });

            queue.listen({ MaxNumberOfMessages: 1 }, msgs => {
                expect(msgs).to.be.an.instanceof(Array);

                const expected = msgs.filter(msg => {
                    return msg.Body === msgBody
                });

                expect(expected).to.have.length.above(0);

                expect(expected[0]).to.be.an.instanceof(SQS.Queue.Message);
                expect(expected[0].toString()).to.match(/\[[^\]]+\] - '.+'/)

                expected[0].delete(response => {
                    done();
                });
            });

            myMessage.send();
        });
    });
});

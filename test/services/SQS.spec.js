'use strict';

const expect = require('chai').expect;

// Require SQS AWSService Class
const { SQS } = require('../../');


describe('SQS', function() {
    const sqs = new SQS({
        region: 'us-west-2'
    });

    const queueParams = {
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/782771874404/cmr1-travis-ci-test'
    };

    it('should exist', function() {
        expect(SQS).to.exist;
    });

    it('should be able to send & receive messages', function(done) {
        sqs.getQueue({ QueueName: 'Test-Queue-1' }, queue => {
            const msgBody = 'This is a test message';
            
            const myMessage = queue.newMessage({
                Body: msgBody
            });

            queue.listen(msgs => {
                expect(msgs).to.be.an.instanceof(Array);

                const expected = msgs.filter(msg => {
                    return msg.Body === msgBody
                });

                expect(expected).to.have.length.above(0);

                expect(expected[0]).to.be.an.instanceof(SQS.Queue.Message);
                expect(expected[0].toString()).to.match(/\[[^\]]+\] - '.+'/)

                done();
            });

            myMessage.send();
        });
    });
});

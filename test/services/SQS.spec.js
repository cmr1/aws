'use strict';

const expect = require('chai').expect;

// Require SQS Service Class
const { SQS } = require('../../services');


describe('SQS', function() {
    const sqs = new SQS({
        // region: 'us-west-2'
        region: 'us-east-1'
    });

    const queueParams = {
        QueueUrl: ' https://sqs.us-west-2.amazonaws.com/782771874404/cmr1-travis-ci-test'
    };

    it('should exist', function() {
        expect(SQS).to.exist;
    });

    it('should be able to send & receive messages', function(done) {
        const msgBody = 'This is a test message';

        const myMessage = sqs.newMessage({
            Body: msgBody
        });

        // TODO: Figure out test account ...
        done();

        // sqs.listen(queueParams, msgs => {
        //     expect(msgs).to.be.an.instanceof(Array);

        //     const expected = msgs.filter(msg => {
        //         return msg.Body === msgBody
        //     });

        //     expect(expected).to.have.length.above(0);

        //     expect(expected[0]).to.be.an.instanceof(SQS.Message);

        //     done();
        // });

        // myMessage.send(queueParams);
    });
});

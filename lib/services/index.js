'use strict';

module.exports = {
    S3: require('./s3'),
    SQS: require('./sqs'),
    ECS: require('./ecs'),
    Route53: require('./route53')
};
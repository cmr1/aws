'use strict'

module.exports = {
  S3: require('./s3'),
  SES: require('./ses'),
  SQS: require('./sqs'),
  ECS: require('./ecs'),
  ACM: require('./acm'),
  Route53: require('./route53')
}

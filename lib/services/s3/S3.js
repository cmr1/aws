'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSService = require(primitivesPath).AWSService
const Bucket = require('./Bucket')

class S3 extends AWSService {
  getBucket (name) {
    return new Bucket(name, this)
  }

  getBuckets () {
    const { params, callback } = S3.getArgs(arguments)

    return this.listBuckets(params, callback).then(({ Buckets = [] }) => {
      return Promise.resolve(Buckets.map(bucket => this.getBucket(bucket.Name)))
    })
  }

  supportedMethods () {
    return [
      {
        method: 'listBuckets'
      }
    ]
  }

  static get Bucket () {
    return Bucket
  }
}

module.exports = S3

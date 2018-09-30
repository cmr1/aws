'use strict'

const expect = require('chai').expect

// Require S3 AWSService Class
const { S3 } = require('../../')

describe('S3', function () {
  const s3 = new S3()

  it('should exist', function () {
    expect(S3).to.exist
  })

  it('instance has supported methods', function () {
    s3.supportedMethods().forEach(methodConfig => {
      expect(s3[methodConfig.method]).to.be.a('function')
    })
  })

  it('should be able to get buckets', async function () {
    const buckets = await s3.getBuckets()

    expect(buckets).to.be.an.instanceof(Array)

    if (buckets.length > 0) {
      expect(buckets[0]).to.be.an.instanceof(S3.Bucket)
    }
  })

  describe('Bucket', function () {
    let bucket = null

    before(async function () {
      const buckets = await s3.getBuckets()

      expect(buckets).to.be.an.instanceof(Array)

      if (buckets.length > 0) {
        bucket = buckets[0]
      }

      expect(bucket).to.exist
      expect(bucket).to.be.an.instanceof(S3.Bucket)
    })

    it('instance has supported methods', function () {
      bucket.supportedMethods().forEach(methodConfig => {
        expect(bucket[methodConfig.method]).to.be.a('function')
      })
    })

    it('should be able to get a list of items', async function () {
      const items = await bucket.getItems()

      expect(items).to.be.an.instanceof(Array)

      if (items.length > 0) {
        expect(items[0]).to.be.an.instanceof(S3.Bucket.Item)
      }
    })
  })
})

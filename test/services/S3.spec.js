'use strict';

const expect = require('chai').expect;

// Require S3 AWSService Class
const { S3 } = require('../../');

describe('S3', function() {
    const s3 = new S3();

    it('should exist', function() {
        expect(S3).to.exist;
    });

    it('instance has supported methods', function() {
        s3.supportedMethods().forEach(methodConfig => {
            expect(s3[methodConfig.method]).to.be.a('function');
        });
    });

    it('should be able to get buckets', function(done) {
        s3.getBuckets(buckets => {
            expect(buckets).to.be.an.instanceof(Array);

            if (buckets.length > 0) {
                expect(buckets[0]).to.be.an.instanceof(S3.Bucket);
            }

            done();
        });
    });

    describe('Bucket', function() {
        let bucket = null;

        before(function(done) {
            s3.getBuckets(buckets => {
                if (buckets.length > 0) {
                    bucket = buckets[0];
                }

                expect(bucket).to.exist;

                done();
            });
        });

        it('instance has supported methods', function() {
            bucket.supportedMethods().forEach(methodConfig => {
                expect(bucket[methodConfig.method]).to.be.a('function');
            });
        });

        it('should be able to get a list of items', function() {
            bucket.getItems(items => {

            })
        })
    });
});
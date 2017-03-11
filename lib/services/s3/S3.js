'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSService = require(primitivesPath).AWSService;
const Bucket = require('./Bucket');

class S3 extends AWSService {
    getBucket(name) {
        return new Bucket(name, this);
    }

    getBuckets() {
        const { params, callback } = S3.getArgs(arguments);

        this.listBuckets(params, data => {
            const bucketList = data.Buckets || [];

            callback(bucketList.map(bucketData => {
                return this.getBucket(bucketData.Name);
            }));
        });
    }

    supportedMethods() {
        return [
            {
                method: 'listBuckets'
            }
        ];
    }

    static get Bucket() {
        return Bucket;
    }
}

module.exports = S3;

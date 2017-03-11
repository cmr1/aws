'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;

class Item extends AWSResource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            Key: this.Key
        });
    }

    supportedMethods() {
        return [
            {
                method: 'getObjectAcl',
                required: [
                    'Bucket',
                    'Key'
                ]
            }
        ];
    }
}

module.exports = Item;

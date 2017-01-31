'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Resource = require(primitivesPath).Resource;

class Item extends Resource {
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

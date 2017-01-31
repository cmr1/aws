'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Resource = require(primitivesPath).Resource;
const Item = require('./Item');

class Bucket extends Resource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            Bucket: this.name
        });
    }

    getItems() {
        const { params, callback } = Bucket.getArgs(arguments);
        // const { params } = Bucket.getArgs(arguments);

        this.listObjects(params, response => {
            const items = [];

            if (response.Contents) {
                response.Contents.forEach(itemData => {
                    items.push(new Item(itemData, this));
                });
            }

            callback(items);
        });

        // return new Promise((resolve, reject) => {
        //     try {
        //         this.listObjects(params, response => {
        //             const items = [];
        //
        //             if (response.Contents) {
        //                 response.Contents.forEach(itemData => {
        //                     items.push(new Item(itemData, this));
        //                 });
        //             }
        //
        //             resolve(items);
        //         });
        //     } catch (err) {
        //         reject(err);
        //     }
        // });
    }

    supportedMethods() {
        return [
            {
                method: 'listObjects'
            },
            {
                method: 'listObjectsV2'
            },
            {
                method: 'getObjectAcl',
                required: [
                    'Key'
                ]
            }
        ];
    }

    static get Item() {
        return Item;
    }
}

module.exports = Bucket;

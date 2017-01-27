'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Resource = require(primitivesPath).Resource;
const RecordSet = require('./RecordSet');

class Zone extends Resource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            HostedZoneId: this.Id
        });
    }

    getRecordSets() {
        const { params, callback } = Zone.getArgs(arguments);

        this.listResourceRecordSets(params, data => {
            const recordSets = data.ResourceRecordSets || [];

            callback(recordSets.map(recordData => {
                return new RecordSet(recordData, this);
            }));
        });
    }

    newRecordSet() {
        const { params } = Zone.getArgs(arguments);

        return new RecordSet(params, this);
    }

    supportedMethods() {
        return [
            {
                method: 'listResourceRecordSets'
            },
            {
                method: 'changeResourceRecordSets',
                required: [
                    'ChangeBatch'
                ]
            }
        ];
    }

    static get RecordSet() {
        return Record;
    }
}

module.exports = Zone;

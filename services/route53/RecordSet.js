'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Resource = require(primitivesPath).Resource;
const ChangeBatch = require('./ChangeBatch');

class RecordSet extends Resource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            HostedZoneId: this.parent.Id
        });
    }

    getChange(action) {
        return {
            Action: action,
            ResourceRecordSet: this.properties
        }
    }

    create() {
        const { callback } = RecordSet.getArgs(arguments);

        this.change('CREATE', callback);
    }

    upsert() {
        const { callback } = RecordSet.getArgs(arguments);

        this.change('UPSERT', callback);
    }

    delete() {
        const { callback } = RecordSet.getArgs(arguments);

        this.change('DELETE', callback);
    }

    change() {
        const { action, callback } = RecordSet.getArgs(arguments, {
            'string': 'action'
        });

        const params = {
            ChangeBatch: {
                Changes: [
                    this.getChange(action)
                ]
            }
        };

        this.changeResourceRecordSets(params, resp => {
            if (resp.ChangeInfo) {
                const batch = new ChangeBatch(resp.ChangeInfo, this.service);

                batch.wait(callback);
            }
        });
    }

    supportedMethods() {
        return [
            {
                method: 'changeResourceRecordSets',
                required: [
                    'ChangeBatch'
                ]
            }
        ];
    }

    static get ChangeBatch() {
        return ChangeBatch;
    }
}

module.exports = RecordSet;

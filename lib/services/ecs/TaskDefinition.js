'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;

class TaskDefinition extends AWSResource {
    constructor() {
        super(...arguments);

        this.autoPaginate = false;

        this.setDefaultParams({
            taskDefinitionArn: this.taskDefinitionArn
        });
    }

    supportedMethods() {
        return [
            // {
            //     method: 'getObjectAcl',
            //     required: [
            //         'Bucket',
            //         'Key'
            //     ]
            // }
        ];
    }
}

module.exports = TaskDefinition;

'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;
const TaskDefinition = require('./TaskDefinition');

class Task extends AWSResource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            task: this.taskArn
        });
    }

    getDefinition() {
        const { params, callback } = Task.getArgs(arguments);

        this.service.describeTaskDefinition(Object.assign({}, { taskDefinition: this.taskDefinitionArn }, params), response => {
            if (response.taskDefinition) {
                return callback(new TaskDefinition(response.taskDefinition, this));
            }

            return callback(null);
        });
    }

    stop() {
        const { params, callback } = Task.getArgs(arguments);

        this.stopTask(params, response => {
            if (response.taskArn && response.taskArn === this.taskArn) {
                callback();
            } else {
                Task.error('Oops');
            }
        });
    }

    supportedMethods() {
        return [
            {
                method: 'stopTask', 
                required: [
                    'task',
                    'cluster'
                ]
            }            
        ];
    }
}

module.exports = Task;

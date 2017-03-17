'use strict';

const path = require('path');
const async = require('async');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSService = require(primitivesPath).AWSService;
const Cluster = require('./Cluster');
const TaskDefinition = require('./TaskDefinition');

class ECS extends AWSService {
    constructor() {
        super(...arguments);

        // this.autoPaginate = false;
    }

    newCluster() {
        const { params, callback } = ECS.getArgs(arguments);

        this.createCluster(params, response => {
            if (response.cluster) {
                return callback(new Cluster(response.cluster, this));
            } else {
                return callback();
            }
        });
    }

    newTaskDefinition() {
        const { params, callback } = ECS.getArgs(arguments);

        this.registerTaskDefinition(params, response => {
            if (response.taskDefinition) {
                return callback(new TaskDefinition(response.taskDefinition, this));
            } else {
                return callback();
            }
        });
    }

    getClusters() {
        const { params, callback } = ECS.getArgs(arguments);

        this.listClusters(params, response => {
            if (response.clusterArns && response.clusterArns.length > 0) {
                this.describeClusters({ clusters: response.clusterArns }, response => {
                    const clusters = [];
        
                    if (response.clusters) {
                        response.clusters.forEach(cluster => {
                            clusters.push(new Cluster(cluster, this));
                        });
                    }
        
                    return callback(clusters);
                });
            } else {
                return callback([]);
            }
        });
    }

    getTaskDefinitions() {
        const { params, callback } = ECS.getArgs(arguments);

        this.listTaskDefinitions(params, response => {
            if (response.taskDefinitionArns && response.taskDefinitionArns.length > 0) {
                const taskDefinitions = [];

                async.each(response.taskDefinitionArns, (taskDefinitionArn, next) => {
                    this.describeTaskDefinition({ taskDefinition: taskDefinitionArn }, response => {
                        if (response.taskDefinition) {
                            taskDefinitions.push(new TaskDefinition(response.taskDefinition, this));
                        }

                        next();
                    });
                }, (err) => {
                    return callback(taskDefinitions);
                });
            } else {
                return callback([]);
            }
        });
    }

    supportedMethods() {
        return [
            {
                method: 'createCluster',
                required: [
                    'clusterName'
                ]
            },
            {
                method: 'listClusters'
            },
            {
                method: 'describeClusters',
                required: [
                    'clusters'
                ]
            },
            {
                method: 'listTaskDefinitions'
            },
            {
                method: 'describeTaskDefinition',
                required: [
                    'taskDefinition'
                ]
            }, {
                method: 'registerTaskDefinition',
                required: [
                    'family',
                    'containerDefinitions'
                ]
            }
        ];
    }

    static get Cluster() {
        return Cluster;
    }

    static get TaskDefinition() {
        return TaskDefinition;
    }
}

module.exports = ECS;

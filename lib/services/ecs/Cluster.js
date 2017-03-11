'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;
const Task = require('./Task');
const Service = require('./Service');
const ContainerInstance = require('./ContainerInstance');

class Cluster extends AWSResource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            cluster: this.clusterName
        });
    }

    delete() {
        const { params, callback } = Cluster.getArgs(arguments);

        this.deleteCluster(params, callback);
    }

    newService() {
        const { params, callback } = Cluster.getArgs(arguments);

        this.createService(params, response => {
            if (response.service) {
                return callback(new Service(response.service, this));
            }

            return callback();
        });
    }

    getTasks() {
        const { params, callback } = Cluster.getArgs(arguments);

        this.listTasks(params, response => {
            if (response.taskArns && response.taskArns.length > 0) {
                this.describeTasks({ tasks: response.taskArns }, response => {
                    const tasks = [];

                    if (response.tasks) {
                        response.tasks.forEach(task => {
                            tasks.push(new Task(task, this));
                        });
                    }

                    return callback(tasks);
                });
            } else {
                return callback([]);
            }
        });
    }

    getServices() {
        const { params, callback } = Cluster.getArgs(arguments);

        this.listServices(params, response => {
            if (response.serviceArns && response.serviceArns.length > 0) {
                this.describeServices({ services: response.serviceArns }, response => {
                    const services = [];

                    if (response.services) {
                        response.services.forEach(service => {
                            services.push(new Service(service, this));
                        });
                    }

                    return callback(services);
                });
            } else {
                return callback([]);
            }
        });
    }

    getContainerInstances() {
        const { params, callback } = Cluster.getArgs(arguments);

        this.listContainerInstances(params, response => {
            if (response.containerInstanceArns && response.containerInstanceArns.length) {
                this.describeContainerInstances({ containerInstances: response.containerInstanceArns }, response => {
                    const containerInstances = [];

                    if (response.containerInstances) {
                        response.containerInstances.forEach(ci => {
                            containerInstances.push(new ContainerInstance(ci, this));
                        });
                    }

                    return callback(containerInstances);
                });
            } else {
                return callback([]);
            }
        });
    }

    supportedMethods() {
        return [
            {
                method: 'deleteCluster',
                required: [
                    'cluster'
                ]
            },
            {
                method: 'createService',
                required: [
                    'desiredCount',
                    'serviceName',
                    'taskDefinition'
                ]
            },
            {
                method: 'listTasks',
                required: [
                    'cluster'
                ]
            },
            {
                method: 'describeTasks',
                required: [
                    'cluster',
                    'tasks'
                ]
            },
            {
                method: 'listServices',
                required: [
                    'cluster'
                ]
            },
            {
                method: 'describeServices',
                required: [
                    'cluster',
                    'services'
                ]
            },
            {
                method: 'listContainerInstances',
                required: [
                    'cluster'
                ]
            },
            {
                method: 'describeContainerInstances',
                required: [
                    'cluster',
                    'containerInstances'
                ]
            }
        ];
    }

    static get Task() {
        return Task;
    }

    static get Service() {
        return Service;
    }

    static get ContainerInstance() {
        return ContainerInstance;
    }
}

module.exports = Cluster;

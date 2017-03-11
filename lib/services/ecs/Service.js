'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;
const Task = require('./Task');

class Service extends AWSResource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            serviceName: this.serviceName
        });
    }

    getTasks() {
        const { params, callback } = Service.getArgs(arguments);

        this.parent.getTasks(Object.assign({}, { serviceName: this.serviceName }, params), callback);
    }

    supportedMethods() {
        return [
     
        ];
    }
}

module.exports = Service;

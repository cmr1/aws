'use strict';

const Service = require('./Service');
const Dynamic = require('./Dynamic');

class Resource extends Dynamic {
    constructor() {
        super(...arguments);

        const { service, resource, properties } = Resource.getArgs(arguments, {
            'object': (obj) => {
                if (obj instanceof Service) {
                    return 'service';
                } else if (obj instanceof Resource) {
                    return 'resource';
                }

                return 'properties';
            }
        });

        if (resource) {
            this.defaultParams = Object.assign({}, this.defaultParams, resource.defaultParams);
        }

        this.service = service || resource.service;

        if (!this.service) {
            Resource.error(`Missing service for resource: ${this.name}!`);
        }

        Resource.debug(`Creating AWS ${this.name} resource for ${this.service.name} service`);

        this.setProperties(properties);

        this.buildMethods();
    }

    setProperties() {
        const { properties } = Resource.getArgs(arguments, {
            'object': 'properties'
        });

        if (typeof properties === 'object') {
            Object.keys(properties).forEach(key => {
                if (typeof this[key] !== 'undefined') {
                    Resource.error(`Conflicting property key: '${key}'`);
                }

                this[key] = properties[key];
            });
        }
    }
}

module.exports = Resource;

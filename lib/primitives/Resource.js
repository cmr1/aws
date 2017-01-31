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

        this.parent = resource || service;

        this.service = service || resource.service;

        if (!this.service) {
            Resource.error(`Missing service for resource: ${this.name}!`);
        }

        Resource.debug(`Creating AWS ${this.name} resource for ${this.service.name} service`);

        this.setProperties(properties);

        this.buildMethods();
    }

    setProperties(properties, safe = true) {
        if (typeof properties === 'object') {
            this.properties = Object.assign({}, properties);

            Object.keys(this.properties).forEach(key => {
                if (safe && typeof this[key] !== 'undefined') {
                    Resource.error(`Conflicting property key: '${key}'`);
                }

                this[key] = this.properties[key];
            });
        }
    }
}

module.exports = Resource;

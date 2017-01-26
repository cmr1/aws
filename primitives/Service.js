'use strict';

const AWS = require('aws-sdk');
const Dynamic = require('./Dynamic');

class Service extends Dynamic {
    constructor() {
        super(...arguments);

        Service.debug(`Creating AWS ${this.name} service`);

        this.handler = (typeof AWS[this.name] === 'function') ? new AWS[this.name](...arguments) : null;

        this.buildMethods();
    }

    hasMethod(method) {
        return typeof method === 'string' && typeof this.handler[method] === 'function';
    }

    generic() {
        const { method, params, callback, required } = Service.getArgs(arguments);

        if (required) {
            Service.requireParams(params, required);
        }

        if (typeof callback !== 'function') {
            Service.warn(`Executing generic method '${method}' without callback!`);
        }

        Service.debug('Executing method:', method, 'with params:', params);

        this.exec(method, params).then(data => {
            Service.debug('Result:', data);

            if (data.IsTruncated) {
                Service.debug('Result is truncated');

                let nextMarker = data.NextMarker;

                if (typeof nextMarker !== 'string') {
                    nextMarker = data.Contents[data.Contents.length - 1].Key;
                }

                Service.debug('Load nextMarker:', nextMarker);

                const next_params = Object.assign({}, params, {
                    Marker: nextMarker
                });

                this.generic(method, next_params, callback);
            }

            if (typeof callback === 'function') {
                callback(data);
            }
        }).catch(Service.error);
    }

    exec() {
        const { method, params } = Service.getArgs(arguments);

        return new Promise((resolve, reject) => {
            if (typeof this.handler[method] !== 'function') {
                reject(`Invalid service method: ${this.name}:${method}`);
            }

            if (typeof params !== 'object') {
                reject('Invalid params');
            }

            this.handler[method](params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = Service;

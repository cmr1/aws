'use strict';

const async = require('async');
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

    reduceResponses(responses = []) {
        if (!Array.isArray(responses)) {
            Service.error('Can only reduce Arrays!');
        }

        Service.debug('Reducing ' + responses.length + ' responses');

        if (responses.length === 1) {
            Service.debug('Returning single response');
            return responses[0];
        } else if (responses.length > 1) {
            Service.debug('Collapsing immediate arrays...');

            const template = responses[0];

            for (let i=1; i<responses.length; i++) {
                const response = responses[i];

                Object.keys(template).forEach(key => {
                    if (Array.isArray(template[key]) && Array.isArray(response[key])) {
                        template[key] = template[key].concat(response[key]);
                    }
                });
            }

            return template;
        }

        Service.warn('Unable to reduce responses!');

        return {};
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

        let isFinished = true;

        const responses = [];

        async.doWhilst(
            (next) => {
                this.exec(method, params).then(data => {
                    Service.debug('Result:', data);

                    responses.push(data);

                    isFinished = !data.IsTruncated;

                    if (data.IsTruncated) {
                        Service.debug('Result is truncated');

                        let nextMarker = data.NextMarker;

                        if (typeof nextMarker !== 'string') {
                            nextMarker = data.Contents[data.Contents.length - 1].Key;
                        }

                        Service.debug('Load nextMarker:', nextMarker);

                        params.Marker = nextMarker;
                    }

                    next();
                }).catch(Service.error);
            },
            () => {
                return !isFinished;
            },
            (err) => {
                if (typeof callback === 'function') {
                    callback(this.reduceResponses(responses));
                }
            }
        );
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

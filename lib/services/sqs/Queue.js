'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;
const Message = require('./Message');

class Queue extends AWSResource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            QueueUrl: this.name
        });
    }

    sendMessage() {
        const { bodyString, bodyObject, callback } = Queue.getArgs(arguments, {
            'string': 'bodyString',
            'object': 'bodyObject'
        });

        if (bodyString && bodyObject) {
            Queue.error('Provide only one body source! (string or object, both were provided)');
        }

        const newMessage = this.newMessage({
            Body: bodyObject ? JSON.stringify(bodyObject) : bodyString
        });

        newMessage.send(callback);
    }

    newMessage() {
        const { params } = Queue.getArgs(arguments);

        return new Message(params, this);
    }

    listen() {
        const { params, callback } = Queue.getArgs(arguments);

        Queue.debug(`Listening to queue url: `, this.defaultParams);

        this.receiveMessage(params, data => {
            if (data.Messages) {
                callback(data.Messages.map(msg => {
                    return new Message(msg, this);
                }));
            }

            this.listen(...arguments);
        });
    }

    supportedMethods() {
        return [
            {
                method: 'receiveMessage',
                required: [
                    'QueueUrl',
                ]
            }
        ];
    }

    static get Message() {
        return Message;
    }
}

module.exports = Queue;

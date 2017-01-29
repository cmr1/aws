'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Service = require(primitivesPath).Service;
const Message = require('./Message');

class SQS extends Service {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            // Default SQS parameters
        });
    }

    sendMessage() {
        const { bodyString, bodyObject, callback } = SQS.getArgs(arguments, {
            'string': 'bodyString',
            'object': 'bodyObject'
        });

        if (bodyString && bodyObject) {
            SQS.error('Provide only one body source! (string or object, both were provided)');
        }

        const newMessage = this.newMessage({
            Body: bodyObject ? JSON.stringify(bodyObject) : bodyString
        });

        newMessage.send(callback);
    }

    newMessage() {
        const { params } = SQS.getArgs(arguments);

        return new Message(params, this);
    }

    listen() {
        const { params, callback } = SQS.getArgs(arguments);

        SQS.debug(`Listening to queue url: `, this.defaultParams);

        this.receiveMessage(params, data => {
            if (data.Messages) {
                callback(data.Messages.map(msg => {
                    msg.QueueUrl = params.QueueUrl;
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

module.exports = SQS;

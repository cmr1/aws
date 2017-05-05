'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;

const REGEX_VALID_EMAIL_ADDRESS = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Email extends AWSResource {
    constructor() {
        super(...arguments);

        this._to = [];
        this._cc = [];
        this._bcc = [];
        this._replyTo = [];
        this._from = null;
        this._subject = 'No Subject';
        this._body = '';
        this._bodyType = 'html';
    }

    setFrom(from) {
        if (Email.isValidEmailAddress(from)) {
            this._from = from;
        }
    }

    setTo(to) {
        this._setEmailList('_to', to);
    }

    setCc(cc) {
        this._setEmailList('_cc', cc);
    }

    setBcc(bcc) {
        this._setEmailList('_bcc', bcc);
    }

    setReplyTo(replyTo) {
        this._setEmailList('_replyTo', replyTo);
    }

    setSubject(subject) {
        this._subject = subject;
    }

    setBody(body) {
        this._body = body;
    }

    setBodyType(type) {
        if (type === 'html') {
            this._bodyType = 'html';
        } else {
            this._bodyType = 'text';
        }
    }

    getMessageData() {
        const data = {
            Source: this._from,
            Destination: {
                ToAddresses: this._to,
                CcAddresses: this._cc,
                BccAddresses: this._bcc
            },
            Message: {
                Subject: {
                    Data: this._subject
                },
                Body: {}
            },
            ReplyToAddresses: this._replyTo
        };

        if (this._bodyType === 'html') {
            data.Message.Body.Html = {
                Data: this._body
            };
        } else {
            data.Message.Body.Text = {
                Data: this._body
            };
        }

        return data;
    }

    send() {
        const { params, callback } = Email.getArgs(arguments);

        Email.debug('Sending email');

        var merged = Object.assign({}, this.getMessageData(), params);

        this.sendEmail(merged, response => {
            this.setProperties(response);

            if (typeof callback === 'function') {
                callback(response);
            }
        });
    }

    supportedMethods() {
        return [
            {
                method: 'sendEmail',
                required: [
                    'Source',
                    'Destination',
                    'Message'
                ]
            }
        ];
    }

    _setEmailList(key, val) {
        if (!this[key]) {
            Email.error(`Invalid key: ${key}`);
        }

        if (Array.isArray(val)) {
            val.forEach(emailAddress => {
                if (Email.isValidEmailAddress(emailAddress)) {
                    this[key].push(emailAddress);
                } else {
                    Email.error(`Invalid Email Address: '${emailAddress}'`);
                }
            });
        } else if (Email.isValidEmailAddress(val)) {
            this[key].push(val);
        } else {
            Email.error(`Invalid Email Address: '${val}'`);
        }
    }

    static isValidEmailAddress(emailAddress) {
        return REGEX_VALID_EMAIL_ADDRESS.test(emailAddress);
    }
}

module.exports = Email;

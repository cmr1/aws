'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;

class Certificate extends AWSResource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            CertificateArn: this.CertificateArn
        });
    }

    update() {
        const { params, callback } = Certificate.getArgs(arguments);

        this.importCertificate(params, response => {
            if (response.CertificateArn === this.CertificateArn) {
                return callback(this);
            } else {
                return callback(response);
            }
        });
    }

    supportedMethods() {
        return [
            {
                method: 'importCertificate',
                required: [
                    'Certificate',
                    'PrivateKey',
                    // 'CertificateArn',
                    // 'CertificateChain'
                ]
            },
        ];
    }
}

module.exports = Certificate;

'use strict';

const path = require('path');
const async = require('async');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSService = require(primitivesPath).AWSService;
const Certificate = require('./Certificate');

class ACM extends AWSService {
    constructor() {
        super(...arguments);
    }

    getCertByDomain() {
        const { domain, callback } = ACM.getArgs(arguments, {
            'string': 'domain'
        });

        this.getCertificates(certs => {
            const filtered = certs.filter(c => { return c.DomainName === domain });

            const cert = filtered.length > 0 ? filtered[0] : null;

            return callback(cert);
        });
    }

    getCertificates() {
        const { params, callback } = ACM.getArgs(arguments);

        this.listCertificates(params, response => {
            const certificates = [];

            if (response.CertificateSummaryList) {
                response.CertificateSummaryList.forEach(cert => {
                    certificates.push(new Certificate(cert, this));
                });
            }

            return callback(certificates);
        });
    }

    supportedMethods() {
        return [
            {
                method: 'deleteCertificate',
                required: [
                    'CertificateArn'
                ]
            },
            {
                method: 'getCertificate',
                required: [
                    'CertificateArn'
                ]
            },
            {
                method: 'importCertificate',
                required: [
                    'Certificate',
                    'PrivateKey',
                    // 'CertificateArn',
                    // 'CertificateChain'
                ]
            },
            {
                method: 'listCertificates',
                // CertificateStatuses
            }
        ];
    }

    static get Certificate() {
        return Certificate
    }
}

module.exports = ACM;

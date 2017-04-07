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

    createCertificate() {
        const { params, callback } = ACM.getArgs(arguments);

        this.importCertificate(params, response => {
            return callback(new Certificate(response, this));
        });
    }

    createOrUpdateCert() {
        const { domain, params, callback } = ACM.getArgs(arguments, {
            'string': 'domain'
        });

        if (typeof domain === 'string' && domain.trim() !== '') {
            this.getCertByDomain(domain, cert => {
                if (cert) {
                    cert.update(params, callback);
                } else {
                    this.createCertificate(params, callback);
                }
            });
        } else {
            this.createCertificate(params, callback);
        }
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
                    'PrivateKey'
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

'use strict'

const path = require('path')

const primitivesPath = path.join('..', '..', 'primitives')

const AWSService = require(primitivesPath).AWSService
const Certificate = require('./Certificate')

class ACM extends AWSService {
  createCertificate () {
    const { params, callback } = ACM.getArgs(arguments)

    return this.importCertificate(params, callback).then(response => {
      return Promise.resolve(new Certificate(response, this))
    })
  }

  createOrUpdateCert () {
    const { domain, params, callback } = ACM.getArgs(arguments, {
      'string': 'domain'
    })

    if (typeof domain === 'string' && domain.trim() !== '') {
      return this.getCertByDomain(domain).then(cert => {
        if (cert) {
          return cert.update(params, callback)
        } else {
          return this.createCertificate(params, callback)
        }
      })
    } else {
      return this.createCertificate(params, callback)
    }
  }

  getCertByDomain () {
    const { domain } = ACM.getArgs(arguments, {
      'string': 'domain'
    })

    return this.getCertificates().then(certs => {
      const filtered = certs.filter(c => c.DomainName === domain)

      const cert = filtered.length > 0 ? filtered[0] : null

      return Promise.resolve(cert)
    })
  }

  getCertificates () {
    const { params, callback } = ACM.getArgs(arguments)

    return this.listCertificates(params, callback).then(({ CertificateSummaryList = [] }) => {
      return Promise.resolve(CertificateSummaryList.map(cert => new Certificate(cert, this)))
    })
  }

  supportedMethods () {
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
        method: 'listCertificates'
        // CertificateStatuses
      }
    ]
  }

  static get Certificate () {
    return Certificate
  }
}

module.exports = ACM

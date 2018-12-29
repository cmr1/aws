'use strict'

const fs = require('fs')
const path = require('path')
const async = require('async')
const expect = require('chai').expect

// Require ACM AWSService Class
const { ACM } = require('../../')

describe('ACM', function () {
  const acm = new ACM()
  let certCount = 0

  it('should exist', function () {
    expect(ACM).to.exist
  })

  it('instance has supported methods', function () {
    acm.supportedMethods().forEach(methodConfig => {
      expect(acm[methodConfig.method]).to.be.a('function')
    })
  })

  it('should be able to get certificates', async function () {
    const certs = await acm.getCertificates()

    expect(certs).to.be.an('array')
    expect(certs.length).to.be.at.least(0)

    certCount = certs.length
  })

  describe('Certificate', function () {
    let cert = null
    const certDomain = 'acm.test.aws.cmr1.com'
    const certData = {
      Certificate: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem')), /* required */
      PrivateKey: fs.readFileSync(path.join(__dirname, '..', 'certs', 'privkey.pem')), /* required */
      CertificateChain: fs.readFileSync(path.join(__dirname, '..', 'certs', 'chain.pem'))
    }

    before(function (done) {
      done()

      // acm.createCertificate(certData, objCert => {
      //     expect(objCert).to.be.an.instanceOf(ACM.Certificate);

      //     done();
      // });
    })

    // it('should be able to update an existing cert', function (done) {
    //     acm.createOrUpdateCert(certDomain, certData, cert => {
    //         expect(cert).to.be.an.instanceOf(ACM.Certificate);

    //         done();
    //     });
    // });

    // it('should be able to create another cert', function (done) {
    //     acm.createCertificate(certData, cert => {
    //         expect(cert).to.be.an.instanceOf(ACM.Certificate);

    //         acm.getCertificates(certs => {
    //             expect(certs).to.be.an('array');
    //             expect(certs.length).to.greaterThan(1);

    //             done();
    //         });
    //     });
    // });

    // it('should be able to delete an existing cert', function (done) {
    //     expect(cert).to.be.an.instanceof(ACM.Certificate);

    //     cert.delete(done);
    // });

    after(function (done) {
      // acm.getCertificates(certs => {
      //     async.each(certs, (cert, next) => {
      //         expect(cert).to.be.an.instanceof(ACM.Certificate);

      //         cert.delete(next);
      //     }, err => {
      //         expect(err).to.be.empty;

      //         done();
      //     });
      // });
    })
  })

  after(async function () {
    const certs = await acm.getCertificates()

    expect(certs).to.be.an('array')
    expect(certs.length).to.equal(certCount)
  })
})

'use strict'

const expect = require('chai').expect

const { SES } = require('../../')

describe('SES', function () {
  let ses = null

  before(function (done) {
    ses = new SES()

    expect(ses).to.be.an.instanceof(SES)

    done()
  })

  it('should exist', function () {
    expect(SES).to.exist
  })

  describe('Email', function () {
    let email = null
    const to = 'to@example.com'
    const cc = 'cc@example.com'
    const bcc = 'bcc@example.com'
    const from = 'noreply@example.com'
    const replyTo = 'replyto@example.com'
    const subject = 'Test Email'
    const body = 'This is a message. <strong>With HTML</strong>'
    const bodyType = 'html'

    before(function (done) {
      email = ses.newEmail()

      expect(email).to.be.an.instanceof(SES.Email)

      done()
    })

    it('should be able to set "to"', function (done) {
      email.setTo(to)

      expect(email._to.length).to.equal(1)

      expect(email._to[0]).to.equal(to)

      done()
    })

    it('should be able to set "cc"', function (done) {
      email.setCc(cc)

      expect(email._cc.length).to.equal(1)

      expect(email._cc[0]).to.equal(cc)

      done()
    })

    it('should be able to set "bcc"', function (done) {
      email.setBcc(bcc)

      expect(email._bcc.length).to.equal(1)

      expect(email._bcc[0]).to.equal(bcc)

      done()
    })

    it('should be able to set "from"', function (done) {
      email.setFrom(from)

      expect(email._from).to.equal(from)

      done()
    })

    it('should be able to set "replyTo"', function (done) {
      email.setReplyTo(replyTo)

      expect(email._replyTo.length).to.equal(1)

      expect(email._replyTo[0]).to.equal(replyTo)

      done()
    })

    it('should be able to set "subject"', function (done) {
      email.setSubject(subject)

      expect(email._subject).to.equal(subject)

      done()
    })

    it('should be able to set "body"', function (done) {
      email.setBody(body)

      expect(email._body).to.equal(body)

      done()
    })

    it('should be able to set "bodyType"', function (done) {
      email.setFrom(bodyType)

      expect(email._bodyType).to.equal(bodyType)

      done()
    })

    after(function (done) {
      const data = {
        Source: from,
        Destination: {
          ToAddresses: [ to ],
          CcAddresses: [ cc ],
          BccAddresses: [ bcc ]
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Html: {
              Data: body
            }
          }
        },
        ReplyToAddresses: [ replyTo ]
      }

      expect(email.getMessageData()).to.eql(data)

      done()
    })
  })
})

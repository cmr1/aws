'use strict'

const expect = require('chai').expect

const { SES } = require('../../')

describe('SES', function () {
  let ses = null

  before(function () {
    ses = new SES()

    expect(ses).to.be.an.instanceof(SES)
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

    before(function () {
      email = ses.newEmail()

      expect(email).to.be.an.instanceof(SES.Email)
    })

    it('should be able to set "to"', function () {
      email.setTo(to)

      expect(email._to.length).to.equal(1)
      expect(email._to[0]).to.equal(to)
    })

    it('should be able to set "cc"', function () {
      email.setCc(cc)

      expect(email._cc.length).to.equal(1)
      expect(email._cc[0]).to.equal(cc)
    })

    it('should be able to set "bcc"', function () {
      email.setBcc(bcc)

      expect(email._bcc.length).to.equal(1)
      expect(email._bcc[0]).to.equal(bcc)
    })

    it('should be able to set "from"', function () {
      email.setFrom(from)

      expect(email._from).to.equal(from)
    })

    it('should be able to set "replyTo"', function () {
      email.setReplyTo(replyTo)

      expect(email._replyTo.length).to.equal(1)
      expect(email._replyTo[0]).to.equal(replyTo)
    })

    it('should be able to set "subject"', function () {
      email.setSubject(subject)

      expect(email._subject).to.equal(subject)
    })

    it('should be able to set "body"', function () {
      email.setBody(body)

      expect(email._body).to.equal(body)
    })

    it('should be able to set "bodyType"', function () {
      email.setFrom(bodyType)

      expect(email._bodyType).to.equal(bodyType)
    })

    after(function () {
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
    })
  })
})

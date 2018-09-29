'use strict'

const uuid = require('uuid')
const expect = require('chai').expect

// Require Route53 AWSService Class
const { Route53 } = require('../../')

describe('Route53', function () {
  const r53 = new Route53()

  it('should exist', function () {
    expect(Route53).to.exist
  })

  it('instance has supported methods', function () {
    r53.supportedMethods().forEach(methodConfig => {
      expect(r53[methodConfig.method]).to.be.a('function')
    })
  })

  it('should be able to create and delete zones', function (done) {
    this.timeout(10000)

    r53.getZoneCount(startingCount => {
      expect(startingCount).to.be.a('number')
      expect(startingCount).to.be.at.least(0)

      r53.createZone({
        Name: 'route53.aws.test.cmr1.com',
        CallerReference: uuid.v1()
      }, zone => {
        expect(zone).to.be.an.instanceof(Route53.Zone)

        zone.delete(resp => {
          expect(resp.ChangeInfo).to.exist

          r53.getZoneCount(endingCount => {
            expect(endingCount).to.equal(startingCount)
            done()
          })
        })
      })
    })
  })

  it('should be able to get zones and verify total count', function (done) {
    this.timeout(10000)

    r53.getZoneCount(count => {
      expect(count).to.be.a('number')
      expect(count).to.be.at.least(0)

      r53.getZones(zones => {
        expect(zones).to.be.an.instanceof(Array)
        expect(zones.length).to.equal(count)

        if (zones.length > 0) {
          expect(zones[0]).to.be.an.instanceof(Route53.Zone)
        }

        done()
      })
    })
  })
})

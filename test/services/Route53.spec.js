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

  it('should be able to create and delete zones', async function () {
    this.timeout(10000)

    const startingCount = await r53.getZoneCount()

    expect(startingCount).to.be.a('number')
    expect(startingCount).to.be.at.least(0)

    const zone = await r53.createZone({
      Name: 'route53.aws.test.cmr1.com',
      CallerReference: uuid.v1()
    })

    expect(zone).to.be.an.instanceof(Route53.Zone)

    const resp = await zone.delete()

    expect(resp.ChangeInfo).to.exist

    const endingCount = await r53.getZoneCount()

    expect(endingCount).to.equal(startingCount)
  })

  it('should be able to get zones and verify total count', async function () {
    this.timeout(10000)

    const count = await r53.getZoneCount()

    expect(count).to.be.a('number')
    expect(count).to.be.at.least(0)

    const zones = await r53.getZones()

    expect(zones).to.be.an.instanceof(Array)
    expect(zones.length).to.equal(count)

    if (zones.length > 0) {
      expect(zones[0]).to.be.an.instanceof(Route53.Zone)
    }
  })
})

'use strict'

const expect = require('chai').expect

// Require AWSResource Class
const { AWSResource } = require('../../lib/primitives')

describe('AWSResource', function () {
  it('should exist', function () {
    expect(AWSResource).to.exist
  })
})

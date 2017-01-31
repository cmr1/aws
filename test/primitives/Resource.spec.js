'use strict';

const expect = require('chai').expect;

// Require Resource Class
const { Resource } = require('../../lib/primitives');

describe('Resource', function() {
    it('should exist', function() {
        expect(Resource).to.exist;
    });
});

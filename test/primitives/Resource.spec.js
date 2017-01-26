'use strict';

const expect = require('chai').expect;

// Require Resource Class
const { Resource } = require('../../primitives');

describe('Resource', function() {
    it('should exist', function() {
        expect(Resource).to.exist;
    });
});

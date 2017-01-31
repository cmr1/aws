'use strict';

const expect = require('chai').expect;

// Require Service Class
const { Service } = require('../../lib/primitives');

describe('Service', function() {
    it('should exist', function() {
        expect(Service).to.exist;
    });
});

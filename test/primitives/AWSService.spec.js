'use strict';

const expect = require('chai').expect;

// Require AWSService Class
const { AWSService } = require('../../lib/primitives');

describe('AWSService', function() {
    it('should exist', function() {
        expect(AWSService).to.exist;
    });
});

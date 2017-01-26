'use strict';

const expect = require('chai').expect;

// Require Dynamic Class
const { Dynamic } = require('../../primitives');

describe('Dynamic', function() {
    it('should exist', function() {
        expect(Dynamic).to.exist;
    });
});
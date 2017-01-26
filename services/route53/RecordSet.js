'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Resource = require(primitivesPath).Resource;

class RecordSet extends Resource {
    constructor() {
        super(...arguments);

        // this.setDefaultParams({
        //     HostedZoneId: this.Id
        // });
    }

    supportedMethods() {
        return [
            
        ];
    }
}

module.exports = RecordSet;

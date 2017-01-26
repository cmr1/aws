'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Service = require(primitivesPath).Service;
const Zone = require('./Zone');

class Route53 extends Service {
		getZoneCount() {

		}

		getZones() {
				const { params, callback } = Route53.getArgs(arguments);

        this.listHostedZones(params, data => {
            const hostedZones = data.HostedZones || [];

            callback(hostedZones.map(zoneData => {
                return new Zone(zoneData, this);
            }));
        });
		}

		getZoneByName() {
				const { name, callback } = Route53.getArgs(arguments, {
					'string': 'name'
				});

				this.getZones((zones) => {
						const filtered = zones.filter(zone => {
							return zone.Name === name.trim() || zone.Name === name.trim() + '.';
						});

						if (filtered.length > 0) {
							return callback(filtered[0]);
						} else {
							callback();
						}
				});
		}

    supportedMethods() {
        return [
            {
                method: 'listHostedZones'
            },
            {
            		method: 'listHostedZonesByName'
            },
            {
            		method: 'getHostedZone'
            },
            {
            		method: 'getHostedZoneCount'
            }
        ];
    }
}

module.exports = Route53;

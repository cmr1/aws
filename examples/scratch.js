'use strict';

const { S3, SQS, Route53 } = require('./services');

Route53.verbose();

const r53 = new Route53();

const domain = 'bt.banekicksass.com';

r53.getZoneByName(domain, zone => {
	if (zone) {
		const recordSet = zone.newRecordSet({
			Name: `super-stuff.${domain}.`,
			Type: 'TXT',
			TTL: 60,
			ResourceRecords: [
				{
					Value: `"abc123"`
				}
			]
		});

		recordSet.upsert(resp => {
			Route53.log('Upserted record set!');
		
			recordSet.delete(resp => {
				Route53.log('Deleted record set!');
			});
		});
	} else {
		Route53.error(`Missing zone for domain: ${domain}`)
	}
});

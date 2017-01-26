'use strict';

const { S3, SQS, Route53 } = require('./services');

// const S3 = require('./s3');
// const SQS = require('./sqs');
// const Utility = require('./Utility');
//
// Utility.verbose();

// S3.verbose();

console.log(process.argv);

// const r53 = new Route53();

// r53.getZoneByName('bt1.f11assnipe.com', zone => {
// 	if (zone) {
// 		zone.getRecordSets(recordSets => {
// 			recordSets.forEach(rs => {
// 				let ttl = rs.TTL || 'none'
// 				let str = `${rs.Type} [${ttl}] - ${rs.Name} ==>`;

// 				if (rs.AliasTarget && rs.AliasTarget.DNSName) {
// 					str += ` (alias) "${rs.AliasTarget.DNSName}"`;
// 				} else if (rs.ResourceRecords) {
// 					str += '"';

// 					rs.ResourceRecords.forEach(r => {
// 						str += `${r.Value},`;
// 					});
				
// 					str += '"';
// 				}

// 				Route53.warn(str);
// 			})
// 		});	
// 	}
// });

// r53.getZones((zones) => {
// 	console.log(zones);
// });









// const s3 = new S3();
// const sqs = new SQS({
//     // region: 'us-west-2'
//     region: 'us-east-1'
// });

// const queueParams = {
//     QueueUrl: 'https://sqs.us-east-1.amazonaws.com/776426860670/QuantumTest',
//     // QueueUrl: "https://sqs.us-west-2.amazonaws.com/590744054339/BowtieTest"
// };

// setTimeout(function() {
//     const payload = {
//         action: 'obtain-ssl',
//         domain: 'www.example.com'
//     };
//
//     const msg = sqs.newMessage({
//         Body: JSON.stringify(payload)
//     });
//
//     msg.send(queueParams, response => {
//         Utility.log('Message sent: ', msg.MessageId);
//         Utility.log('Message sent: ', response);
//     });
//
//
//     // sqs.sendMessage(payload, response => {
//     //     Utility.log('Message sent:', response);
//     // });
// }, 5000);
//
// sqs.listen(queueParams, msgs => {
//     msgs.forEach(msg => {
//         let str = `msg [${msg.MessageId}] - '${msg.Body}'`;
//
//         Utility.log(`Received: ${str}`);
//         Utility.debug('Parsed body:', msg.parseBody());
//
//         if (typeof msg.parsed === 'object') {
//             if (msg.parsed.action && msg.parsed.domain && msg.parsed.action === 'obtain-ssl') {
//                 Utility.log(`Obtaining SSL for domain: ${msg.parsed.domain}`);
//
//                 msg.delete(resp => {
//                     Utility.log(`Deleted: ${str}`);
//                     Utility.debug('Response:', resp);
//                 });
//             } else {
//                 Utility.log(`Ignoring msg: ${str}`);
//             }
//         } else {
//             Utility.log(`Ignoring msg: ${str}`);
//         }
//     });
// });

// s3.getBuckets(buckets => {
//     S3.log(buckets);
// });

// const bucket = s3.getBucket('quantum-bucket-policy-test');

// bucket.getItems({ MaxKeys: 2 }).then(items => {
//     Utility.debug(items);
// });

// bucket.getItems(items => {
//     items.forEach(item => {
//         item.getObjectAcl(data => {
//             Utility.debug(`Item: ${item.Key} has ACL:`, data);
//         });
//     });
// });

// bucket.listObjects({ MaxKeys: 2 }, objectList => {
//     Utility.log('Done');
// });

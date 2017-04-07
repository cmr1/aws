'use strict';

const fs = require('fs');

const { S3, SQS, Route53, ECS, ACM } = require('../lib/services');

const acm = new ACM({
	region: 'us-east-1'
});

const certData = {
		Certificate: fs.readFileSync('cert.pem'), /* required */
		PrivateKey: fs.readFileSync('privkey.pem'), /* required */
		CertificateChain: fs.readFileSync('fullchain.pem')
	};

acm.createOrUpdateCert('dev.api.quantum.autodesk.com', certData, cert => {
	console.log(cert);
});



// var params = {
//   Certificate: fs.readFileSync('cert.pem'), /* required */
//   PrivateKey: fs.readFileSync('privkey.pem'), /* required */
// //   CertificateArn: 'STRING_VALUE',
//   CertificateChain: fs.readFileSync('fullchain.pem')
// };

// acm.importCertificate(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// ECS.verbose();

// const ecs = new ECS({
// 	region: 'us-east-1'
// });

// // ecs.newCluster({ clusterName: 'testing-auto' }, cluster => {
// // 	console.log(cluster);

// // 	cluster.delete(response => {
// // 		console.log(`Deleted cluster: ${cluster.clusterName}`, response);
// // 	});
// // });

// ecs.newCluster({ clusterName: 'bowtie-v1-test' }, cluster => {
// 	ecs.getTaskDefinitions({ 
// 		maxResults: 1, 
// 		familyPrefix: 'family-prefix' 
// 	}, taskDefinitions => {
// 		console.log(`Found ${taskDefinitions.length} task definition(s)`);

// 		taskDefinitions[0].run({
// 			cluster: cluster.clusterName,
// 			count: 1,
// 			group: 'task-group',
// 			startedBy: 'cmr1-aws',
// 			overrides: {
// 				taskRoleArn: 'arn:aws:iam::ACCOUNT_ID:role/ecs-task-role',
// 				containerOverrides: [
// 					{
// 						name: 'container name',
// 						environment: [
// 							{
// 								name: 'ENV_VAR',
// 								value: 'something'
// 							}
// 						]
// 					}
// 				]
// 			}
// 		}, task => {

// 			console.log(task);
// 		});

// 		// cluster.runTaskDefinition(taskDefinitions[0], task => {
// 		// 	console.log(task);
// 		// });
// 	});
// });



// ecs.getClusters(clusters => {
// 	// console.log(clusters);
// 	console.log(`Found ${clusters.length} cluster(s)!\n\n`);

// 	clusters.forEach(cluster => {
// 		cluster.getServices(services => {
// 			services.forEach(service => {
// 				service.getTasks(tasks => {
// 					console.log(`${cluster.name} [${services.length} service(s)]`);
// 					console.log(`\t- ${service.name} [${tasks.length} task(s)]`);

// 					tasks.forEach(task => {
// 						console.log(`\t\t- ${task.taskArn}`);

// 						task.getDefinition(taskDefinition => {
// 							console.log(taskDefinition.family, taskDefinition.revision);
// 						});
// 					});
// 				});
// 			});
// 		});

// 		// cluster.getContainerInstances(resp => {
// 		// 	console.log(resp);
// 		// });

// 		// cluster.getTasks(resp => {
// 		// 	console.log(resp);
// 		// });
// 	});
// });

// const sqs = new SQS({
// 	region: 'us-west-2'
// });

// sqs.getQueue({ QueueName: 'BS-Queue' }, queue => {
// 	console.log(queue);
// });

// sqs.getQueueUrl({ QueueName: 'BS-Queue' }, (err, data) => {
// 	console.log(err,data);
// });

// Route53.verbose();

// const r53 = new Route53();

// const domain = 'bt.banekicksass.com';

// r53.getZoneByName(domain, zone => {
// 	if (zone) {
// 		const recordSet = zone.newRecordSet({
// 			Name: `super-stuff.${domain}.`,
// 			Type: 'TXT',
// 			TTL: 60,
// 			ResourceRecords: [
// 				{
// 					Value: `"abc123"`
// 				}
// 			]
// 		});

// 		recordSet.upsert(resp => {
// 			Route53.log('Upserted record set!');
		
// 			recordSet.delete(resp => {
// 				Route53.log('Deleted record set!');
// 			});
// 		});
// 	} else {
// 		Route53.error(`Missing zone for domain: ${domain}`)
// 	}
// });

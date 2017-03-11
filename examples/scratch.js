'use strict';

const { S3, SQS, Route53, ECS } = require('../lib/services');

// ECS.verbose();

const ecs = new ECS({
	region: 'us-east-1'
});

// ecs.getTaskDefinitions(taskDefinitions => {
// 	console.log(taskDefinitions);
// });

ecs.getClusters(clusters => {
	// console.log(clusters);
	console.log(`Found ${clusters.length} cluster(s)!\n\n`);

	clusters.forEach(cluster => {
		cluster.getServices(services => {
			services.forEach(service => {
				service.getTasks(tasks => {
					console.log(`${cluster.name} [${services.length} service(s)]`);
					console.log(`\t- ${service.name} [${tasks.length} task(s)]`);

					tasks.forEach(task => {
						console.log(`\t\t- ${task.taskArn}`);

						task.getDefinition(taskDefinition => {
							console.log(taskDefinition.family, taskDefinition.revision);
						});
					});
				});
			});
		});

		// cluster.getContainerInstances(resp => {
		// 	console.log(resp);
		// });

		// cluster.getTasks(resp => {
		// 	console.log(resp);
		// });
	});
});

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

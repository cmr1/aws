'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const AWSResource = require(primitivesPath).AWSResource;

class ContainerInstance extends AWSResource {
    constructor() {
        super(...arguments);

        // this.setDefaultParams({
        //     cluster: this.clusterName
        // });
    }

    // getContainerInstances() {
    //     const { params, callback } = Cluster.getArgs(arguments);

    //     this.listContainerInstances(params, response => {
    //         if (response.containerInstanceArns) {
    //             this.describeContainerInstances({ containerInstances: response.containerInstanceArns }, response => {
    //                 const containerInstances = [];

    //                 if (response.containerInstances) {
    //                     response.containerInstances.forEach(ci => {
    //                         containerInstances.push(new ContainerInstance(ci, this));
    //                     });
    //                 }

    //                 callback(containerInstances);
    //             });
    //         }
    //     });
    // }

    supportedMethods() {
        return [
            // {
            //     method: 'listServices',
            //     required: [
            //         'cluster'
            //     ]
            // },
            // {
            //     method: 'listContainerInstances',
            //     required: [
            //         'cluster'
            //     ]
            // }
        ];
    }
}

module.exports = ContainerInstance;

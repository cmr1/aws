'use strict';

const path = require('path');

const primitivesPath = path.join('..', '..', 'primitives');

const Resource = require(primitivesPath).Resource;

class ChangeBatch extends Resource {
    constructor() {
        super(...arguments);

        this.setDefaultParams({
            Id: this.Id
        });

        this.timeout = 300000;
        this.elapsed = 0;
        this.interval = 2000;
    }

    wait() {
  		const { params, callback } = ChangeBatch.getArgs(arguments);

  		this.getChange(params, resp => {
  			if (!resp.ChangeInfo) {
  				ChangeBatch.error('Missing ChangeInfo from getChange()!');
  			}

  			this.setProperties(resp.ChangeInfo, false);

  			if (this.Status === 'PENDING') {
  				ChangeBatch.debug('Waiting for pending change:', this.Id);

  				if (this.elapsed <= this.timeout) {
						setTimeout(() => {
	  					this.elapsed += this.interval;
	  					this.wait(params, callback);
	  				}, this.interval);
  				} else {
  					ChangeBatch.error(`ChangeBatch timed out! timeout = ${this.timeout}ms, interval = ${this.interval}`);
  				}
  			} else {
  				ChangeBatch.debug('Done waiting for change:', this.Id);
  				ChangeBatch.debug('Status is:', this.Status);

  				if (this.Status === 'INSYNC') {
  					return callback();
  				} else {
  					ChangeBatch.error(`Unexpected ChangeBatch status while waiting: "${this.Status}"`)
  				}
  			}
  		});
    }

    supportedMethods() {
        return [
        	{
        		method: 'getChange'
        	}
        ];
    }
}

module.exports = ChangeBatch;

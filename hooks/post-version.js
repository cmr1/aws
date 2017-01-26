'use strict';

const path = require('path');
const replace = require('replace');
const rootDir = path.join(__dirname, '..');
const packageInfo = require(path.join(rootDir, 'package.json'));

console.log(`Updating markdown files with tagged TravisCI badge to version: "${packageInfo.version}"`);

replace({
	regex: /https\:\/\/travis\-ci\.org\/cmr1\/node-aws\.svg\?branch\=v[0-9]+\.[0-9]+\.[0-9]+/,
	replacement: `https://travis-ci.org/cmr1/node-aws.svg?branch=v${packageInfo.version}`,
	paths: [
		rootDir
	],
	include: '*.md',
	recursive: true,
	silent: false
});

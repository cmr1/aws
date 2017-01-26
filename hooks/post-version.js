'use strict';

const path = require('path');
const replace = require('replace');
const rootDir = path.join(__dirname, '..');
const packageInfo = require(path.join(rootDir, 'package.json'));

console.log(`Updating markdown files with tagged TravisCI badge to version: "${packageInfo.version}"`);

replace({
	regex: /(https\:\/\/travis\-ci\.org\/cmr1\/node-aws\.svg\?branch\=|\|\s*)v[0-9]+\.[0-9]+\.[0-9]+(\s*\|)?/g,
	replacement: `$1v${packageInfo.version}$2`,
	paths: [
		rootDir
	],
	include: '*.md',
	recursive: true,
	silent: false
});

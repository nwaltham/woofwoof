#!/usr/bin/env node
'use strict';

const woofwoof = require('.');

const cli = woofwoof({
	env: ['nothing'],
	description: 'Custom description',
	help: `
		Usage
		  foo <input>
	`
}, {
	alias: {
		u: 'unicorn'
	},
	default: {
		woofwoof: 'dog',
		camelCaseOption: 'foo'
	}
});

if (cli.flags.camelCaseOption === 'foo') {
	
	Object.keys(cli.flags).forEach(x => {
		console.log(x);
	});
} else {
	console.log(cli.flags.camelCaseOption);
}
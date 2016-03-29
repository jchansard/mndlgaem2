const $ = require('jquery');
const test = require('./mndltest').test($);
const testCases = require('./tests');

test.run(testCases);
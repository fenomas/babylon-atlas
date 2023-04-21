'use strict'

var path = require('path')


module.exports = {
	mode: 'development',
	entry: './example.js',
	output: {
		path: path.resolve('..', 'docs'),
		filename: 'bundle.js',
	},
	stats: "minimal",
	devServer: {
		static: path.resolve('..', 'docs'),
		host: "0.0.0.0",
	},
}

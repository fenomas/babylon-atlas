'use strict'

var path = require('path')


module.exports = {
	mode: 'development',
	entry: './example.js',
	output: {
		path: path.resolve('..', 'docs'),
		filename: 'bundle.js',
	},
	devServer: {
		contentBase: path.resolve('..', 'docs'),
		inline: true,
		host: "0.0.0.0",
		stats: "minimal",
	},
}

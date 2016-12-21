/* eslint-disable */

const webpack = require('webpack');
const path = require('path');

const BUILD_DIR= path.resolve(__dirname, 'dist');         // Build directory
const APP_DIR= path.resolve(__dirname, 'src/js');    // Source directory

const webpackConfig = {
	
	entry: [APP_DIR + '/script.js'],

	output: {
		path: BUILD_DIR,
		filename: '[name].js'
	},

	module: {

		loaders: [
			{
				test: /\.js?/,
				exclude: /node_modules/,
				include: APP_DIR,
				loader: 'babel'
			}
		]
	},

	devtool: 'source-map'
};

if(process.argv.includes('-p')) {
	
	webpackConfig.devtool= false;

	webpackConfig.plugins= [		
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"production"'
			}
		})
	];
}

module.exports = webpackConfig;

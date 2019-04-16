const webpack = require('webpack');

exports.loadJs = function ({ include, exclude }) {
	return {
		module: {
			rules: [
				{
					test: /\.js$/,
					include,
					exclude,
					loader: 'babel-loader',
					options: { cacheDirectory: true }
				}
			]
		}
	}
}
exports.loadTs = function ({ include = [], exclude = [] }) {
	const tsImportPluginFactory = require('ts-import-plugin');
	return {
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					include,
					exclude,
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
						getCustomTransformers: () => ({
							before: [tsImportPluginFactory({
								libraryName: 'antd',
                libraryDirectory: 'lib',
                style: 'css'
							})]
						}),
						compilerOptions: {
							module: 'es2015'
						}
					}
				}
			]
		}
	}
}
exports.loadImages = function ({ include, exclude, options }) {
	return {
		module: {
			rules: [
				{
					test: /\.(jpe?g|png|gif|svg)$/,
					include,
					exclude,
					use: {
						loader: 'url-loader',
						options,
					},
				}
			]
		}
	}
}
exports.loadFonts = function ({ include, exclude, options } = {}) {
	return {
		module: {
			rules: [
				{
					test: /\.(woff2?|ttf|svg|eot)(\?=\d+\.\d+\.\d+)?$/,
					include,
					exclude,
					use: {
						loader: 'file-loader',
						options,
					}
				}
			]
		}
	}
}
exports.setDevtool = function (type) {
	return {
		devtool: type,
	}
}

exports.loadCss = function ({ include, exclude, options }) {
	// const autoprefixer = require('autoprefixer');
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: { importLoaders: 1 }
						}
					]
				},
			]
		}
	}
}
exports.loadLess = function ({ include, exclude, options }) {
	return {
		module: {
			rules: [
				{
					test: /\.less$/,
					include,
					exclude,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: { importLoaders: 1 }
						},
						'less-loader',
					]
				},
			]
		}
	}
}
exports.loadExtractLess = function ({ include, exclude, filename = "style.css", publicPath, module }) {
	// const autoprefixer = require('autoprefixer');
	const extractTextPlugin = require('extract-text-webpack-plugin');
	const LessExtract = new extractTextPlugin({
		filename,
		allChunks: true,
	})
	return {
		module: {
			rules: [
				{
					test: /\.less$/,
					include,
					exclude,
					use: extractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: { module }
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins: [
										autoprefixer({
											browsers: ['ie >= 9', 'ios > 7', 'Android > 4'],
											// flexbox: ios 4+、android 2.3+、winphone8+， ie10+
										})
									]
								}
							},
							'less-loader',
						],
						publicPath,
					})
				},
			]
		},
		plugins: [LessExtract],
	}
}
exports.devServer = function ({ host, port, open, proxy }) {
	return {
		devServer: {
			historyApiFallback: true,
			hot: true,
			stats: 'errors-only',
			host,
			port,
			open,
			proxy,
		},
		plugins: [new webpack.HotModuleReplacementPlugin()]
	}
}

exports.minifyJs = function (useSourceMap = true) {
	return {
		plugins: [
			new webpack
				.optimize
				.UglifyJsPlugin({
					sourceMap: useSourceMap,
					compress: {
						warnings: false,
					}
				})
		]
	}
}

exports.clean = function (path) {
	const cleanWebpackPlugin = require('clean-webpack-plugin');
	return {
		plugins: [new cleanWebpackPlugin([path])]
	}
}

exports.commonsChunk = function (names) {
	return {
		plugins: [new webpack.optimize.CommonsChunkPlugin({ names })]
	}
}

exports.setEnv = function (key, value) {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [new webpack.DefinePlugin(env)]
	};
};



const merge = require('webpack-merge');
const path = require('path');

const htmlWebpackPlugin = require('html-webpack-plugin');
const parts = require('./webpack.parts.js');

const PATHS = {
	src: path.resolve(__dirname, './index.tsx'),
	// build: path.resolve(__dirname, 'dist'),
	// images: path.resolve(__dirname, 'src/assets/images'),
	// font: path.resolve(__dirname, 'src/assets/font'),
	html: path.resolve(__dirname, './index.html'),
}

const common = merge([
	{
		entry: {
			app: PATHS.src,
		},
		output: {
			path: PATHS.build,
			filename: 'fast-console.js',
			library: 'fast-console',
			libraryTarget: 'umd',
		},
		resolve: {
			extensions: ['.js', '.less', 'css', '.tsx', '.ts'],	
		},
		// 是否打包到boundle.js，不打包的话，需要外部<script>标签引入固定包
		plugins: [
			new htmlWebpackPlugin({
				template: PATHS.html,
			})
		]
	},
	parts.loadJs({ include: PATHS.src }),
	parts.loadTs({ include: PATHS.src }),
	/* 没有图片 */
	// parts.loadImages({
	// 	include: PATHS.images,
	// 	options: {
	// 		name: '[name].[ext]',
	// 		limit: 10240,
	// 		outputPath: 'images/',
	// 	}
	// }),
	/* 不管多大都打包 */
	// parts.loadFonts({include: PATHS.font, options: {limit: 10240}}),
]);

module.exports = function (env) {
	if (env == 'production') {
		return merge([
			common,
			parts.setDevtool('cheap-module-source-map'),
			// parts.loadExtractLess({ include: PATHS.src, filename: 'css/style.css', publicPath: '../' }),
			parts.loadLess({include: PATHS.src, exclude: /node_modules/, options: {minimize: true}}),
			parts.loadCss({ options: {minimize: true}}),
			// parts.minifyJs(),
			parts.clean('dist'),
			parts.setEnv('process.env.NODE_ENV', 'production'),
		])
	}
	return merge([
		common,
		parts.setDevtool('eval'),
		// parts.loadLess({ include: PATHS.src, exclude: /node_modules/, }),
		parts.loadCss({}),
		parts.devServer({ host: 'localhost', port: 9999, open: true }),
	])
}





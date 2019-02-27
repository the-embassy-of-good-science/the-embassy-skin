// Loaded modules
require('dotenv').config()
const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack') // Adds the .env variables in our js setup!!!

// Dev url
const proxyServer = process.env.BASE_URL

// Project folder
const outputFolder = './static/'

module.exports = (env, argv) => {
    const devMode = argv.mode === 'development'

    const webpackConfig = {
        entry: {
            'main': [ './src/main.js' ],
        },
        output: {
            path: path.resolve(__dirname, outputFolder),
            filename: devMode ? 'js/[name].dev.js' : 'js/[name].[chunkhash:8].js',
            chunkFilename: devMode ? 'js/[name].dev.js' : 'js/[name].[chunkhash:8].js',
            // Easier navigation in Chrome dev tool source mapping:
            devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
        },
        resolve: {
            modules: [
                'node_modules',
            ]
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }

                    ],
                },
            ]
        },
        // https://webpack.js.org/configuration/performance/
        performance: {
            maxAssetSize: 250000,
            // maxEntrypointSize: 300000,
            hints: 'warning',
            assetFilter: function (assetFilename) {
                if (devMode) return // only run the filesize check when in production mode
                return !(/\.map$/.test(assetFilename)) // ignore .map files
            }
        },
        optimization: {
            minimizer: [
                new OptimizeCSSAssetsPlugin({})
            ],
            splitChunks: {
                cacheGroups: {
                    'vendors': {
                        test: /node_modules/,
                        chunks: (chunk) => {
                            return chunk.name === 'main'
                        },
                        name: 'vendors',
                        enforce: true,
                    }
                },
            }
        },
        plugins: [
            new Dotenv(),
            new CleanWebpackPlugin([
                // wipe the entire static folder
                path.resolve(__dirname, 'web/static/js'),
                path.resolve(__dirname, 'web/static/css'),
            ], {
                // except of this file
                exclude: []
            }),
            new ManifestPlugin({
                publicPath: '/static/',
                fileName: 'manifest.json'
            }),
            new MiniCssExtractPlugin({
                publicPath: '/static/',
                filename: devMode ? 'css/[name].dev.css' : 'css/[name].[chunkhash:8].css',
            }),
            new ErrorOverlayPlugin()
        ]
    }

    if (devMode) {
        webpackConfig.optimization.minimizer.push(new TerserPlugin({
            sourceMap: true,
            cache: true,
            parallel: true,
        }))
        webpackConfig.plugins.push(new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            proxy: proxyServer,
            ghostMode: false,
            notify: false,
            open: false
        }))
    }

    if (!devMode) {
        webpackConfig.optimization.minimizer.push(new TerserPlugin({
            sourceMap: true,
            extractComments: true,
            cache: true,
            parallel: true,
            terserOptions: {
                mangle: {
                    safari10: true,
                    keep_classnames: true,
                    keep_fnames: true,
                }
            }
        }))
    }

    return webpackConfig
}

/**
 * webpack basic config factory
 */
const VuePlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = (pagename) => {
    const isProd = process.env.NODE_ENV === 'production'
    const config = {
        mode: isProd ? 'production' : 'development',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // 单独提取css文件
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    exclude: file => (
                        /node_modules/.test(file) &&
                        !/\.vue\.js/.test(file)
                    )
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader'
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.(le|c)ss$/,
                    use: [
                        'vue-style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')()
                                ]
                            }
                        },
                        'less-loader'
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: `images/${pagename}/[name].[hash:8].[ext]`
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                name: `fonts/${pagename}/[name].[hash:8].[ext]`
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new VuePlugin(),
            new MiniCssExtractPlugin({
                filename: `style/${pagename}.[contenthash:8].css`,
                chunkFilename: `style/${pagename}.[id].[contenthash:8].css`
            })
        ]
    }

    if (process.env.NODE_ENV === 'production') {
        config.optimization.minimizer = [
            new TerserJSPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        drop_console: true
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true },
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: true
            })
        ]
    }
    return config
}

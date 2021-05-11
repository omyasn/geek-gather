const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        main: ['./src/client/pages/Main/index.ts'],
        search: ['./src/client/pages/Search/index.ts'],
        event: ['./src/client/pages/Event/index.ts'],
    },
    devtool: isProd ? 'source-map' : 'inline-source-map',
    mode: isProd ? 'production' : 'development',
    plugins: [ 
        new MiniCssExtractPlugin({
            filename: isProd ? 'css/[name].[contenthash].css' : 'css/[name].css',
        }),
        new AssetsPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css']
    },
    output: {
        path: path.resolve(__dirname, 'public/'),
        publicPath: '/',
        filename: isProd ? 'js/[name].bundle.[contenthash].js' : 'js/[name].bundle.js',
        assetModuleFilename: 'images/[name].[hash][ext][query]'
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /(node_modules)/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                    },
                }, {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                [
                                    'postcss-preset-env', {
                                        autoprefixer: { grid: true }
                                    }
                                ]
                            ],
                        },
                    },
                }],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: path.resolve(__dirname, 'src'),
                type: 'asset',
            }
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
};
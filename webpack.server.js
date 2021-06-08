const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: 'none',
    entry: './src/index.ts',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'public/'),
        publicPath: '/',
        filename: 'server.js',
        assetModuleFilename: 'images/[name].[hash][ext][query]',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css'],
    },
    plugins: [ 
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                include: path.resolve(__dirname, 'src'),
                use: 'babel-loader',
            },
            {
                test: /\.(scss|css)$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: 'css-loader',
                    options: {
                        modules: {
                            exportOnlyLocals: true,
                            localIdentName: '[local]__[hash:base64:10]',
                        },
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
                }, {
                    loader: 'sass-loader',
                }],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: path.resolve(__dirname, 'src'),
                type: 'asset',
            }
        ],
    },
};
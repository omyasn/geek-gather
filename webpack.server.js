const path = require('path');
const nodeExternals = require('webpack-node-externals');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: 'none',
    entry: './src/index.ts',
    target: 'node',
    devtool: isProd ? undefined : 'inline-source-map',
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'public/'),
        publicPath: '/',
        filename: 'server.js',
        assetModuleFilename: 'images/[hash][ext][query]',
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
                options: {
                    modules: {
                        exportOnlyLocals: true,
                    },
                },
                
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css'],
    },
};
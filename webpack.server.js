const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/server/index.ts',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: path.resolve('public'),
        filename: 'server.js',
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
    },
};
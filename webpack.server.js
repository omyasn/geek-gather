const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
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
            {
                test: /\.css$/,
                loader: "css-loader",
                options: {
                    modules: {
                        exportOnlyLocals: true,
                    },
                },
                
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css'],
    },
};
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: ['./src/client/pages/Main/index.ts'],
        search: ['./src/client/pages/Search/index.ts'],
        event: ['./src/client/pages/Event/index.ts'],
    },
    devtool: 'inline-source-map',
    mode: "development",
    plugins: [ new MiniCssExtractPlugin({
        filename: "css/[name].css"
    }) ],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, {
                    loader: "css-loader",
                    options: {
                        modules: true,
                    },
                }],
            }
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".css"]
    },
    output: {
        path: path.resolve(__dirname, "public/"),
        publicPath: "/public/",
        filename: "js/[name].bundle.js"
    },
};
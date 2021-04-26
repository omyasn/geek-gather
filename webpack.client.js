const path = require("path");

module.exports = {
    entry: {
        main: ['./src/client/pages/Main/index.ts'],
        search: ['./src/client/pages/Search/index.ts'],
        event: ['./src/client/pages/Event/index.ts'],
    },
    mode: "development",
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
                use: ["style-loader", "css-loader"]
            }
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
    },
    output: {
        path: path.resolve(__dirname, "public/"),
        publicPath: "/public/",
        filename: "js/[name].bundle.js"
    },
};
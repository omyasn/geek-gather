const path = require("path");

module.exports = {
    entry: "./src/client/index.tsx",
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
        extensions: ["*", ".js", ".jsx", ".json", ".ts", ".tsx"]
    },
    output: {
        path: path.resolve(__dirname, "public/"),
        publicPath: "/public/",
        filename: "client.js"
    },
};
const path = require("path");

const CleanPlugin = require("clean-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    plugins: [
        new CleanPlugin.CleanWebpackPlugin(),
        new HtmlPlugin({
            title: "QLearning Racer",
            template: "./src/assets/index.html"
        }),
        new CopyPlugin([
            {
                from: "./src/assets",
                to: "assets"
            }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                use: "raw-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    }
};
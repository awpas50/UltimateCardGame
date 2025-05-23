const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const webpack = require("webpack")
const dotenv = require("dotenv")

module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.(wav|mp3)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "src/sfx/", // Output folder for your sound files
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: "raw-loader",
            },
            {
                test: /\.(gif|png|jpe?g|svg|xml|glsl)$/i,
                use: "file-loader",
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, "../"),
        }),
        new webpack.DefinePlugin({
            "typeof CANVAS_RENDERER": JSON.stringify(true),
            "typeof WEBGL_RENDERER": JSON.stringify(true),
            "typeof WEBGL_DEBUG": JSON.stringify(true),
            "typeof EXPERIMENTAL": JSON.stringify(true),
            "typeof PLUGIN_3D": JSON.stringify(false),
            "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
            "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
            "typeof FEATURE_SOUND": JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        // new webpack.DefinePlugin({
        //     "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
        //     "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        // }),
    ],
}

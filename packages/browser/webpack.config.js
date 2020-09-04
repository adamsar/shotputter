const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {

    entry: ['./src/main/ts/index.tsx'],
    mode: 'development',
    output: {
        filename: 'shotputter.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
    },
    devServer: {
        port: 9000,
        contentBase: "./dist",
        hot: true
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.svg' ]
    },
    plugins: [
        //new BundleAnalyzerPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                        }
                    },
                    'ts-loader'
                ]
            },

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },

            {
                test: /\.html/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ]
    },
    optimization: process.env.NODE_MODE !== "production" ? {} : {
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
            }})],
        namedModules: false,
        namedChunks: false,
        nodeEnv: 'production',
        flagIncludedChunks: true,
        occurrenceOrder: true,
        sideEffects: true,
        usedExports: true,
        concatenateModules: true,
        noEmitOnErrors: true,
        checkWasmTypes: true,
        minimize: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true
    }
};

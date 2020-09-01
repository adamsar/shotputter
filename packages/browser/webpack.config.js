const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

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

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
            ***REMOVED***
    ***REMOVED***
                    'ts-loader'
                ]
***REMOVED***

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
***REMOVED***

            {
                test: /\.html/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
        ***REMOVED***
    ***REMOVED***]
***REMOVED***
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
***REMOVED***
        ]
    },
    optimization: process.env.NODE_MODE !== "production" ? {} : {
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
***REMOVED***})],
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

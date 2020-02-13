const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: ['./src/main/ts/index.tsx'],
    mode: 'development',
    output: {
        filename: 'shotputter.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.svg' ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template:  "./src/main/templates/index.html"
        })
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
    }
};

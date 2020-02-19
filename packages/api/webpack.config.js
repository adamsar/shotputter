const path = require('path');
module.exports = {
    target: 'node',
    entry: {
        index: './src/main/ts/index.ts',
        cli: './src/main/ts/cli/cli.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {}
    ***REMOVED***
                    'ts-loader'
                ]
***REMOVED***]
    }
};
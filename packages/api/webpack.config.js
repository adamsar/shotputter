const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'node',
    entry: {
        index: './src/main/ts/index.ts',
        cli: './src/main/ts/cli/cli.ts',
        lambda: './src/main/ts/aws/exposed-handler.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        libraryTarget: "umd"
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
                    },
                    'ts-loader'
                ]
            }]
    },
    plugins: [
        new CopyWebpackPlugin([{
                from: "src/main/serverless/serverless-example.yml"
            },
            {
                from: "src/main/docker/Dockerfile"
            }]
        )]
};
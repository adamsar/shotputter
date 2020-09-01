const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    target: 'node',
    entry: {
        index: './src/main/ts/index.ts',
        "shotput-server": './src/main/ts/cli/cli.ts',
        lambda: './src/main/ts/aws/exposed-handler.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ '.ts', '.js', '.json', '.types' ]
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
        new CopyWebpackPlugin({
            patterns: [{
                from: "src/main/serverless/serverless-example.yml",
                to: "serverless/serverless-example.yml"
            },
                {
                    from: "src/main/docker/Dockerfile",
                    to: "docker/Dockerfile"
                }]
        }),
        new webpack.BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true,
            include: ["cli.ts", "shotput-server"]
        })
        ],
    externals: ['fs.promises']
};

import {ServerConfig, getApp} from "../webserver/server";
import * as awsServerlessExpress from "aws-serverless-express";
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

export const lambdaHandler = (config: ServerConfig) => {
    const server = getApp(config);
    server.use(awsServerlessExpressMiddleware.eventContext());
    return awsServerlessExpress.createServer(server);
};
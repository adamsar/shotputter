import {ServerConfig, getApp} from "../webserver/server";
import {applyEnvironmentVars} from "../config/server-config";
const awsServerlessExpress = require('aws-serverless-express');

export const lambdaHandler = (config: ServerConfig) => {
    const proxy = awsServerlessExpress.createServer(getApp(config));

    // @ts-ignore
    return (event, context, callback) => {
        context['callbackWaitsForEmptyEventLoop'] = false;
        // For pinging service;
        if (event['source'] === 'aws.events' && event["detail-type"] === 'Scheduled Event') {
            callback(null, {message: "test", body: "test"});
            return "";
        }
        proxy.proxy(event, context);
    }
};

export const handler = lambdaHandler(applyEnvironmentVars({}));
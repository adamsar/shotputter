import {parseEnv} from "../config/server-config";
import {lambdaHandler} from "./lambda-handler";
import * as awsServerlessExpress from "aws-serverless-express";

const server = lambdaHandler(parseEnv());


// @ts-ignore
export const handler = (event, context, callback) => {
    context['callbackWaitsForEmptyEventLoop'] = false;
    // For pinging service;
    if (event['source'] === 'aws.events' && event["detail-type"] === 'Scheduled Event') {
        callback(null, {message: "test", body: "test"});
        return "";
    }
    return awsServerlessExpress.proxy(server, event, context);
};

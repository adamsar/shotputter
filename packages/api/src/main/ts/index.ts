import {getApp} from "./webserver/server";
import {lambdaHandler} from "./aws/lambda-handler";

export const shotputServer = getApp;
export const shotputLambdaHandler = lambdaHandler;
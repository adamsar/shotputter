import {getApp} from "./webserver/server";
import {handler, lambdaHandler} from "./aws/lambda-handler";


export const shotputServer = getApp;
export const shotputLambdaHandler = lambdaHandler;
export const shotputHandler = handler;
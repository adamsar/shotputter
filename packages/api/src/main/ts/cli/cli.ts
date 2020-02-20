import * as yargs from "yargs";
import {getApp} from "../webserver/server";
import {applyEnvironmentVars, parseFile} from "../config/server-config";

const options = yargs.usage("Usage: cli.js")
    .options({
        'port': {
            type: "number",
            default: 6000
        },
       'githubToken': {
            type: "string"
       },
        'githubRepo': {
            type: 'string'
        },
        'githubOwner': {
            type: 'string'
        },
        'slackClientId': {
            type: "string"
        },
        "imgurClientId": {
            type: "string"
        },
        "configFile": {
            type: "string"
        }
    }).argv;

// @ts-ignore
let _options = options.configFile ? parseFile(options.configFile) : applyEnvironmentVars(options);

const app = getApp(_options);

app.listen(options.port, () => {
    console.log("Serving api on port " + options.port);
});
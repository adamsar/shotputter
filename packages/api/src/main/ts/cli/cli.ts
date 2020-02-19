import * as yargs from "yargs";
import * as boxen from "boxen";
import * as chalk from "chalk";
import {getApp} from "../webserver/server";

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
        }
    }).argv;

const app = getApp({
    github: {
        token: options.githubToken,
        defaultOwner: options.githubOwner,
        defaultRepo: options.githubRepo
    },
    slack: {
        clientId: options.slackClientId
    },
    imgur: {
        clientId: options.slackClientId
    }
});

app.listen(options.port, () => {
    boxen(chalk.green(`Serving shotput API on port ${options.port}`));
});
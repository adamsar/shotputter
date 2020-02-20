import {ServerConfig} from "../webserver/server";
import * as convict from "convict";

export const applyEnvironmentVars = (conf: ServerConfig): ServerConfig => {
    const slackClientId = process.env['SHOTPUT_SLACK_CLIENT_ID'];
    const slackDefaultChannel = process.env['SHOTPUT_SLACK_DEFAULT_CHANNEL'];
    const githubToken = process.env['SHOTPUT_GITHUB_TOKEN'];
    const githubDefaultOwner = process.env['SHOTPUT_GITHUB_DEFAULT_OWNER'];
    const githubDefaultRepo = process.env['SHOTPUT_GITHUB_DEFAULT_REPO'];
    const imgurClientId = process.env['SHOTPUT_IMGUR_CLIENT_ID'];
    return {
        ...((slackClientId || slackDefaultChannel) ? { slack: {clientId: slackClientId || conf.slack?.clientId, defaultChannel: conf.slack?.clientId }} : conf.slack ? {slack: conf.slack} : {}),
        ...((githubToken || githubDefaultOwner || githubDefaultRepo) ? {
            github: {
                token: githubToken || conf.github?.token,
                defaultRepo: githubDefaultRepo || conf.github?.defaultRepo,
                defaultOwner: githubDefaultOwner || conf.github?.defaultOwner
            }
        } : conf.github ? {github: conf.github} : {}),
        ...(imgurClientId ? {
            imgur: {
                clientId: imgurClientId || conf.imgur?.clientId
            }
        } : conf.imgur ? {imgur: conf.imgur} : {})
    };
};

const serverConfigConvictDefinition = convict<ServerConfig>({
    slack: {
        clientId: {
            doc: "Client ID for slack application for posting to channels",
            default: null,
            format: "*",
            env: "SHOTPUT_SLACK_CLIENT_ID"
        },
        defaultChannel: {
            doc: "Default chanell to post to when posting to Slack",
            default: null,
            format: "*",
            env: "SHOTPUT_SLACK_DEFAULT_CHANNEL"
        }
    },
    github: {
        token: {
            doc: "Github token for posting new issues to Github",
            default: null,
            format: "*",
            env: "SHOTPUT_GITHUB_TOKEN"
        },
        defaultRepo: {
            doc: "Default repo name to post issues into",
            default: null,
            format: "*",
            env: "SHOTPUT_GITHUB_DEFAULT_REPO"
        },
        defaultOwner: {
            doc: "Default owner name to post issues into",
            default: null,
            format: "*",
            env: "SHOTPUT_GITHUB_DEFAULT_OWNER"
        }
    },
    imgur: {
        clientId: {
            doc: "Client ID to post images to imgur using",
            default: null,
            format: "*",
            env: "SHOTPUT_IMGUR_CLIENT_ID"
        }
    }
});

export const parseFile = (fileName: string): ServerConfig => {
    return serverConfigConvictDefinition.loadFile(fileName).validate().getProperties();
};
import * as express from "express";
import {Express} from "express";
import {slackRouter} from "./slack/slack-router";
import {githubRouter} from "./github/github-router";
import * as es6Promise from "es6-promise";
es6Promise.polyfill();
import "isomorphic-fetch";
// @ts-ignore

import {atob} from "atob";
// @ts-ignore
global.atob = atob;
// @ts-ignore
import { Blob } from "vblob";
// @ts-ignore
global.Blob = Blob;
import "formdata-polyfill";
// @ts-ignore
console.log(global.FormData);


export interface SlackServerConfig {
    clientId: string;
    defaultChannel?: string;
}

export interface GithubServerConfig {
    token: string;
    defaultOwner?: string;
    defaultRepo?: string;
}

export interface ImgurServerConfig {
    clientId: string;
}

export interface ServerConfig {
    slack?: SlackServerConfig;
    github?: GithubServerConfig;
    imgur?: ImgurServerConfig;
}

export const getApp = (serverConfig: ServerConfig = {}): Express => {
    const app = express();
    const enabledPosters = [];
    app.use(express.json({
        limit: "10mb"
    }));
    if (serverConfig.slack?.clientId) {
        app.use("/slack", slackRouter(serverConfig.slack));
        enabledPosters.push("slack");
    } else {
        console.warn("Slack client id is not configured. Not using Slack integration.")
    }

    if (serverConfig.github?.token && serverConfig.imgur?.clientId) {
        app.use("/github", githubRouter(serverConfig.github, serverConfig.imgur));
    } else {
        if (!serverConfig.imgur?.clientId) {
            console.warn("Imgur clientId not configured, can't add github without an image poster");
        } else {
            console.warn("Github id not configured. Not using Github integration.")
        }
    }
    return app;
};
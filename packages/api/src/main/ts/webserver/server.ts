import {Express} from "express";
import express from "express";
import {slackRouter} from "./slack/slack-router";
import {githubRouter} from "./github/github-router";
import * as es6Promise from "es6-promise";
import "isomorphic-fetch";
// @ts-ignore
import {atob} from "atob";
// @ts-ignore
import {Blob} from "vblob";
import "formdata-polyfill";
import {ImageUploader} from "@shotputter/common/src/main/ts/services/images/uploader";
import {S3Images} from "@shotputter/common/src/main/ts/services/images/s3-images";
import {ImgurUploader} from "@shotputter/common/src/main/ts/services/images/imgur";
import {googleRouter} from "./google/google-router";
import {getJiraRouter} from "./jira/jira-router";
import {CloudinaryUploader} from "./cloudinary/CloudinaryImageUploader";

es6Promise.polyfill();
// @ts-ignore
// @ts-ignore
global.atob = atob;
// @ts-ignore
global.Blob = Blob;

// @ts-ignore


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

export interface S3Config {

    enabled: boolean;
    bucket: string;
    prefix?: string;

}

export interface GoogleConfig {
    enabled: boolean;
    webhookUrl: string;
}

export interface ServerConfig {
    slack?: SlackServerConfig;
    github?: GithubServerConfig;
    imgur?: ImgurServerConfig;
    s3?: S3Config;
    google?: GoogleConfig;
    jira?: JiraConfig;
    cloudinary?: CloudinaryConfig;
}

export interface JiraConfig {
    enabled: boolean;
    username: string;
    password: string;
    host?: string;
}

export interface CloudinaryConfig {
    enabled: boolean;
    cloudName: string;
    apiKey: string;
    apiSecret: string;
}

export const getApp = (serverConfig: ServerConfig = {}): Express => {
    const app = express();
    const enabledPosters = [];
    let imgurUploader: ImageUploader;
    let s3Uploader: ImageUploader;
    let cloudinaryUploader: ImageUploader;

    app.use(express.json({
        limit: "10mb"
    }));
    if (serverConfig.slack?.clientId) {
        console.log("Slack enabled");
        app.use("/slack", slackRouter(serverConfig.slack));
        enabledPosters.push("slack");
    } else {
        console.warn("Slack client id is not configured. Not using Slack integration.")
    }
    if (serverConfig.s3?.enabled) {
        console.log("Using S3 uploads");
        s3Uploader = S3Images(
            process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
            serverConfig.s3.bucket,
            undefined,
            serverConfig.s3.prefix)
    }
    if (serverConfig.imgur?.clientId) {
        console.log("Using Imgur");
        imgurUploader = ImgurUploader(serverConfig.imgur.clientId)
    }
    if (serverConfig.cloudinary?.enabled && serverConfig.cloudinary?.apiKey && serverConfig.cloudinary?.apiSecret && serverConfig.cloudinary?.cloudName) {
        console.log("Using Cloudinary");
        cloudinaryUploader = CloudinaryUploader(serverConfig.cloudinary?.cloudName, serverConfig.cloudinary?.apiKey, serverConfig.cloudinary?.apiSecret);
    }
    const uploader = imgurUploader || s3Uploader || cloudinaryUploader;

    if (serverConfig.github?.token && uploader) {
        console.log("Github enabled");
        app.use("/github", githubRouter(serverConfig.github, uploader));
        enabledPosters.push("github");
    } else {
        if (uploader) {
            console.warn("No image uploader configured");
        } else {
            console.warn("Github id not configured. Not using Github integration.")
        }
    }
    if (serverConfig.google?.webhookUrl && serverConfig.google?.enabled) {
        if (uploader) {
            console.log("Google enabled")
            app.use("/google", googleRouter(serverConfig.google?.webhookUrl, uploader));
        } else {
            console.warn("Google chat enabled, but no image poster was registered! Not using Google chat")
        }
    }
    if (serverConfig.jira?.enabled && serverConfig.jira.username && serverConfig.jira.password) {
        if (uploader) {
            console.log("JIRA enabled");
            app.use("/jira", getJiraRouter(serverConfig.jira, uploader))
        } else {
            console.log("JIRA enabled, but no image poster was registered! Not using JIRA");
        }
    }
    return app;
};

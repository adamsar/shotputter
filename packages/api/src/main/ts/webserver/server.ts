import express, {Express} from "express";
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
import {CustomerImageUploader} from "@shotputter/common/src/main/ts/services/images/custom-uploader";
import {LocalImageArchiver} from "./local_files/LocalImageArchiver";
import chalk from "chalk";
import {isLeft} from "fp-ts/lib/Either";

const cors = require("cors");

es6Promise.polyfill();
// @ts-ignore
// @ts-ignore
global.atob = atob;
// @ts-ignore
global.Blob = Blob;

export interface SlackServerConfig {
    enabled: boolean;
    token: string;
}

export interface GithubServerConfig {
    enabled: boolean;
    token: string;
}

export interface ImgurServerConfig {
    enabled: boolean;
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
    customImageUploader?: CustomImageUploaderConfig;
    files?: FileServerConfig;

}

export interface FileServerConfig {
    enabled: boolean;
    directory: string;
    host: string;
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

export interface CustomImageUploaderConfig {
    enabled: boolean;
    endpoint: string;
}
const enabled = chalk.green("Enabled");
const disabled = chalk.red("Disabled");
const needImageUploader = chalk.yellow("image uploader required")

export const getApp = (serverConfig: ServerConfig = {}): Express => {
    const app = express();
    let imageUploader: ImageUploader;
    const updates: string[] = [];
    let imageUploaderName: string;
    const services: string[] = [];

    app.use(express.json({ limit: "10mb" }));
    app.use(cors());

    if (serverConfig.imgur?.enabled) {
        if (serverConfig.imgur.clientId) {
            updates.push(`Imgur:\t${enabled}`);
            imageUploader = ImgurUploader(serverConfig.imgur.clientId);
            imageUploaderName = "imgur";
        } else {
            updates.push(`Imgur:\t${disabled}\t${chalk.yellow("Client ID needed")}`);
        }
    } else {
        updates.push(`Imgur:\t${disabled}`);
    }

    if (serverConfig.cloudinary?.enabled) {
        if (serverConfig.cloudinary.cloudName) {
            if (serverConfig.cloudinary.apiKey) {
                if (serverConfig.cloudinary.apiSecret) {
                    imageUploader = CloudinaryUploader(serverConfig.cloudinary?.cloudName, serverConfig.cloudinary?.apiKey, serverConfig.cloudinary?.apiSecret);
                    updates.push(`Cloudinary:\t${enabled}`);
                    imageUploaderName = "Cloudinary";
                } else {
                    updates.push(`Cloudinary:\t${disabled}\t${chalk.yellow("apiSecret required")}`);
                }
            } else {
                updates.push(`Cloudinary:\t${disabled}\t${chalk.yellow("apiKey required")}`);
            }
        } else {
            updates.push(`Cloudinary:\t${disabled}\t${chalk.yellow("cloudName required")}`);
        }
    } else {
        updates.push(`Cloudinary:\t${disabled}`)
    }

    if (serverConfig.s3?.enabled) {
        if (serverConfig.s3.bucket) {
            imageUploader = S3Images(
                process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
                serverConfig.s3.bucket,
                undefined,
                serverConfig.s3.prefix)
            imageUploaderName = "S3"
            updates.push(`S3:\t${enabled}`);
        } else {
            updates.push(`S3:\t${disabled}\t${chalk.yellow("Bucket required")}`)
        }
    } else {
        updates.push(`S3:\t${disabled}`);
    }

    if (serverConfig.files?.enabled) {
        if (serverConfig.files.directory) {
            if (serverConfig.files.host) {
                const archiver = LocalImageArchiver(
                    serverConfig.files.directory,
                    serverConfig.files.host
                );
                imageUploader = archiver;
                imageUploaderName = "LocalFiles";
                updates.push(`LocalFiles:\t${enabled}\t${serverConfig.files.directory}`);
                archiver.testWrite()().then(result => {
                    if (isLeft(result)) {
                        console.error(result.left);
                        console.log("Exiting...");
                        process.exit(2);
                    }
                });
            } else {
                updates.push(`LocalFiles:\t${disabled}\t${chalk.yellow("host required")}`);
            }
        } else {
            updates.push(`LocalFiles:\t${disabled}\t${chalk.yellow("directory required")}`);
        }
    } else {
        updates.push(`LocalFiles:\t${disabled}`);
    }
    if (serverConfig.customImageUploader?.enabled) {
        if (serverConfig.customImageUploader.endpoint) {
            imageUploaderName = "CustomImages";
            imageUploader = CustomerImageUploader(serverConfig.customImageUploader?.endpoint);
            updates.push(`CustomImages:\t${enabled}`);
        } else {
            updates.push(`CustomImages:\t${disabled}\tendpoint required`);
        }
    } else {
        updates.push(`CustomImages:\t${disabled}`);
    }

    if (serverConfig.slack?.enabled) {
        if (serverConfig.slack.token) {
            app.use("/slack", slackRouter(serverConfig.slack));
            updates.push(`Slack:\t${enabled}`);
            services.push("Slack");
        } else {
            updates.push(`Slack:\t${disabled}\t${chalk.yellow("token needed")}`);
        }
    } else {
        updates.push(`Slack:${disabled}`)
    }

    if (serverConfig.github?.enabled) {
        if (serverConfig.github.token) {
            if (imageUploader) {
                app.use("/github", githubRouter(serverConfig.github, imageUploader));
                updates.push(`Github:\t${enabled}`);
                services.push("Github");
            } else {
                updates.push(`Github:\t${disabled}\t${needImageUploader}`)
            }
        } else {
            updates.push(`Github:\t${disabled}\t${chalk.yellow("token required")}`)
        }
    } else {
        updates.push(`Github:\t${disabled}`);
    }
    if (serverConfig.google?.enabled) {
        if (serverConfig.google.webhookUrl) {
            if (imageUploader) {
                updates.push(`Google:\t${enabled}`);
                app.use("/google", googleRouter(serverConfig.google?.webhookUrl, imageUploader));
                services.push("Google")
            } else {
                updates.push(`Google:\t${disabled}\t${needImageUploader}`);
            }
        } else {
            updates.push(`Google:\t${disabled}\t${chalk.yellow("webhookUrl required")}`);
        }
    } else {
        updates.push(`Google:\t${disabled}`);
    }

    if (serverConfig.jira?.enabled) {
        if (serverConfig.jira.username) {
            if (serverConfig.jira.password) {
                if (serverConfig.jira.host) {
                    if (imageUploader) {
                        app.use("/jira", getJiraRouter(serverConfig.jira, imageUploader));
                        updates.push(`Jira:\t${enabled}`);
                        services.push("Jira");
                    } else {
                        updates.push(`Jira:\t${disabled}\t${needImageUploader}`);
                    }
                } else {
                    updates.push(`Jira:\t${disabled}\t${chalk.yellow("host required")}`);
                }
            } else {
                updates.push(`Jira:\t${disabled}\t${chalk.yellow("password required")}`);
            }
        } else {
            updates.push(`Jira:\t${disabled}\t${chalk.yellow("username required")}`);
        }
    } else {
        updates.push(`Jira:\t${disabled}`);
    }
    console.log(updates.join("\n"));
    console.log(`Image uploader: ${imageUploaderName ?? "None"}`)
    console.log(`Services available: ${services.join(", ")}`);
    return app;
};

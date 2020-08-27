import {ServerConfig} from "../webserver/server";
import convict from "convict";

export const applyEnvironmentVars = (conf: ServerConfig): ServerConfig => {
    const slackClientId = process.env['SHOTPUT_SLACK_CLIENT_ID'];
    const slackDefaultChannel = process.env['SHOTPUT_SLACK_DEFAULT_CHANNEL'];
    const githubToken = process.env['SHOTPUT_GITHUB_TOKEN'];
    const githubDefaultOwner = process.env['SHOTPUT_GITHUB_DEFAULT_OWNER'];
    const githubDefaultRepo = process.env['SHOTPUT_GITHUB_DEFAULT_REPO'];
    const imgurClientId = process.env['SHOTPUT_IMGUR_CLIENT_ID'];
    const s3Bucket = process.env['S3_BUCKET'];
    const s3Prefix = process.env['S3_PREFIX'];
    const s3Enabled = process.env['S3_ENABLED'] === "true";
    const googleWebhookUrl = process.env['SHOTPUT_GOOGLE_WEBHOOK_URL'];
    const jiraUserName = process.env["SHOTPUT_JIRA_USERNAME"];
    const jiraPassword = process.env["SHOTPUT_JIRA_PASSWORD"];
    const jiraHostName = process.env["SHOTPUT_JIRA_HOST"];
    const cloudinaryCloudName = process.env["SHOTPUT_CLOUDINARY_CLOUD_NAME"];
    const cloudinaryApiKey = process.env["SHOTPUT_CLOUDINARY_API_KEY"];
    const cloudinaryApiSecret = process.env["SHOTPUT_CLOUDINARY_API_SECRET"];
    const customImageUploadUrl = process.env["SHOTPUT_CUSTOM_IMAGE_UPLOAD_URL"];

    return {
        ...((slackClientId || slackDefaultChannel) ? { slack: {clientId: slackClientId || conf.slack?.clientId, defaultChannel: conf.slack?.clientId }} : conf.slack ? {slack: conf.slack} : {}),
        ...((githubToken || githubDefaultOwner || githubDefaultRepo) ? {
***REMOVED***
                token: githubToken || conf.github?.token,
                defaultRepo: githubDefaultRepo || conf.github?.defaultRepo,
                defaultOwner: githubDefaultOwner || conf.github?.defaultOwner
***REMOVED***
        } : conf.github ? {github: conf.github} : {}),
        ...(imgurClientId ? {
            imgur: {
                clientId: imgurClientId || conf.imgur?.clientId
***REMOVED***
        } : conf.imgur ? {imgur: conf.imgur} : {}),
        ...((s3Enabled && s3Bucket) ? {
            s3: {
                enabled: s3Enabled,
                bucket: s3Bucket,
                prefix: s3Prefix
***REMOVED***
        } : {}),
        ...(googleWebhookUrl ? {google: {enabled: true, webhookUrl: googleWebhookUrl}} : {}),
        ...((jiraPassword && jiraUserName && jiraHostName) ? {jira: {enabled: true, password: jiraPassword, username: jiraUserName, host: jiraHostName}}: {}),
        ...((cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) ? {cloudinary: {enabled: true, cloudName: cloudinaryCloudName, apiKey: cloudinaryApiKey, apiSecret: cloudinaryApiSecret}} : {}),
        ...(customImageUploadUrl ? {customImageUploader: {enabled: true, endpoint: customImageUploadUrl}} : {})
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
            doc: "Default channel to post to when posting to Slack",
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
    },
    s3: {
        enabled: {
            doc: "S3 uploading enabled or not",
            default: false,
            format: Boolean,
            env: "S3_ENABLED"
        },
        bucket: {
            doc: "S3 bucket to upload to",
            default: null,
            format: "*",
            env: "S3_BUCKET"
        },
        prefix: {
            doc: "Prefix to prepend to keys being upload to S3",
            default: null,
            format: "*",
            env: "S3_PREFIX"
        }
    },
    google: {
        enabled: {
            doc: "Use google chat hook",
            default: false,
            format: Boolean,
            env: "SHOTPUT_GOOGLE_ENABLED"
        },
        webhookUrl: {
            doc: "Webhook to use to post to google",
            default: null,
            format: "*",
            env: "SHOTPUT_GOOGLE_WEBHOOK_URL"
        }
    },
    jira: {
        enabled: {
            doc: "Post to JIRA enabled",
            default: false,
            format: Boolean,
            env: "SHOTPUT_JIRA_ENABLED"
        },
        username: {
            doc: "Username for authorizing Jira posts",
            default: null,
            format: "*",
            env: "SHOTPUT_JIRA_USERNAME"
        },
        password: {
            doc: "Password for authorizing Jira posts",
            default: null,
            format: "*",
            env: "SHOTPUT_JIRA_PASSWORD"
        },
        host: {
            doc: "Atlassian host for Jira posts",
            default: null,
            format: "*",
            env: "SHOTPUT_JIRA_HOST"
        }
    },
    cloudinary: {
        enabled: {
            doc: "Use cloudinary for posting imaging",
            default: false,
            format: Boolean,
            env: "SHOTPUT_CLOUDINARY_ENABLED"
        },
        cloudName: {
            doc: "Cloud name to post to cloudinary in",
            default: null,
            format: "*",
            env: "SHOTPUT_CLOUDINARY_CLOUD_NAME"
        },
        apiKey: {
            doc: "Api Key for posting to Cloudinary",
            default: null,
            format: "*",
            env: "SHOTPUT_CLOUDINARY_API_KEY"
        },
        apiSecret: {
            doc: "Api secret for posting to Cloudinary",
            default: null,
            format: "*",
            env: "SHOTPUT_CLOUDINARY_API_SECRET"
        }
    },
    customImageUploader: {
        enabled: {
            doc: "Use custom endpoint for uploading images",
            default: false,
            format: Boolean,
            env: "SHOTPUT_CUSTOM_IMAGE_UPLOADER_ENABLED"
        },
        endpoint: {
            doc: "Custom endpoint for posting images to",
            default: null,
            format: "*",
            env: "SHOTPUT_CUSTOM_IMAGE_UPLOAD_URL"
        }
    },
    files: {
        enabled: {
            doc: "Store images on file system",
            default: false,
            format: Boolean,
            env: "SHOTPUT_LOCAL_FILES_ENABLED"
        },
        directory: {
            doc: "Local directory to manage images in",
            default: null,
            format: "*",
            env: "SHOTPUT_LOCAL_FILES_DIRECTORY"
        },
        host: {
            doc: "The host name for this server to use when proving image urls",
            default: null,
            format: "*",
            env: "SHOTPUT_HOST_NAME"
        }
    }
});

export const parseFile = (fileName: string): ServerConfig => {
    return serverConfigConvictDefinition.loadFile(fileName).validate().getProperties();
};

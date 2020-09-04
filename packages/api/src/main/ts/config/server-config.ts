import {ServerConfig} from "../webserver/server";
import convict from "convict";

const serverConfigConvictDefinition = convict<ServerConfig>({
    slack: {
        enabled: {
            doc: "Posting to Slack enabled",
            default: false,
            format: Boolean,
            env: "SHOTPUT_SLACK_ENABLED"
        },
        token: {
            doc: "Token for slack application for posting to channels",
            default: null,
            format: "*",
            env: "SHOTPUT_SLACK_TOKEN"
        }
    },
    github: {
        enabled: {
            doc: "Posting to Github enabled",
            default: false,
            format: Boolean,
            env: "SHOTPUT_GITHUB_ENABLED"
        },
        token: {
            doc: "Github token for posting new issues to Github",
            default: null,
            format: "*",
            env: "SHOTPUT_GITHUB_TOKEN"
        }
    },
    imgur: {
        enabled: {
            doc: "Posting to imgur enabled",
            default: false,
            format: Boolean,
            env: "SHOTPUT_IMGUR_ENABLED"
        },
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
            env: "SHOTPUT_S3_ENABLED"
        },
        bucket: {
            doc: "S3 bucket to upload to",
            default: null,
            format: "*",
            env: "SHOTPUT_S3_BUCKET"
        },
        prefix: {
            doc: "Prefix to prepend to keys being upload to S3",
            default: null,
            format: "*",
            env: "SHOTPUTS3_PREFIX"
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
    console.log("LOADING: " + fileName);
    try {
        return serverConfigConvictDefinition.loadFile(fileName).validate().getProperties();
    } catch (error) {
        console.error(error)
        throw error;
    }
};


export const parseEnv = (): ServerConfig => {
    try {
        return serverConfigConvictDefinition.load({}).validate().getProperties();
    } catch (error) {
        console.error(error)
        throw error;
    }
}

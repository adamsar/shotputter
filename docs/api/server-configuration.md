---
layout: default
title: Server configuration
nav_order: 4
description: "Server configuration in shotputter"
permalink: /server-configuration
---

## Server configuration
The Shotput API server must be configured either by providing a configuration file or environment variables 
when running the [CLI](/shotputter/api#run-via-cli) or [Docker](/shotputter/api#docker) container, and only through environment
variables when run via [serverless](/shotputter/api#aws-serverless).

**At least one image processor must be provided** 

## Configuration options

The config file must be provided in the JSON format, as the example below denotes.

`config.json`


```
{
    "github": {
        "enabled": true,
        "token": "kdsljfklsdjfklsdjflksdj"
    },
    "cloudinary": {
        "enabled": true,
        "cloudName": "xsdks",
        "apiKey": "cloudinary-api-key",
        "apiSecret": "cloudinary-api-secret"
    }
}
```

The table below contains all configuration options for Shotput.

Config Key | Env Var | Type | Description
---- | ---- | ---- | ----- 
`slack.enabled` | `SHOTPUT_SLACK_ENABLED` | *boolean* | Slack is enabled to be written to. `slack.clientId` must also be provided if true 
`slack.token` | `SHOTPUT_SLACK_TOKEN` | *string* | [Slack token](https://api.slack.com/tutorials/slack-apps-and-postman) to use when posting to Slack. 
`github.enabled` | `SHOTPUT_GITHUB_ENABLED` | *boolean* | Github issue posting is enabled. `github.token` must be provided if true. 
`github.token` | `SHOTPUT_GITHUB_TOKEN` | *string* | [Github access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to use when making requests to post Github issues and retrieve repo information. 
`jira.enabled` | `SHOTPUT_JIRA_ENABLED` | *boolean* | Jira project issues posting is enabled. `jira.host`, `jira.username`, and `jira.password` all must be set if true. 
`jira.username` | `SHOTPUT_JIRA_USERNAME` | *string* | Jira username to use when posting to JIRA. 
`jira.password` | `SHOTPUT_JIRA_PASSWORD` | *string* | [Jira access token](https://confluence.atlassian.com/cloud/api-tokens-938839638.html) to use when posting to JIRA. 
`jira.host` | `SHOTPUT_JIRA_HOST` | *string* | Atlassian host to use when posting to JIRA (shotputter.atlassian.net for example). 
`google.enabled` | `SHOTPUT_GOOGLE_ENABLED` | *boolean* | Google chats posting is enabled. `google.webhookUrl` must be provided if true. 
`google.webhookUrl` | `SHOTPUT_GOOGLE_WEBHOOK_URL` | *string* | [The webhook URL](https://developers.google.com/hangouts/chat/how-tos/webhooks) to use when posting to Google chat. 
`imgur.enabled` | `SHOTPUT_IMGUR_ENABLED` | *boolean* | Enable Imgur image processing. `imgur.clientId` must be provided if true. 
`imgur.clientId` | `SHOTPUT_IMGUR_CLIENT_ID` | *string* | [Client ID](https://apidocs.imgur.com/#authorization-and-oauth) to use when posting to Imgur. 
`s3.enabled` | `SHOTPUT_S3_ENABLED`  | *boolean* | S3 image posting is enabled. `s3.bucket` must be provided if true, and [security credentials](https://aws.amazon.com/blogs/security/a-new-and-standardized-way-to-manage-credentials-in-the-aws-sdks/) must be accessible to the system the api is running on. 
`s3.bucket` | `SHOTPUT_S3_BUCKET` | *string* | Which S3 bucket to write to. The system must have access to this bucket. 
`s3.prefix` | `SHOTPUT_S3_PREFIX` | *string* | Optional. Prefix to append to the key of images when uploading to S3. 
`cloudinary.enabled` | `SHOTPUT_CLOUDINARY_ENABLED` | *boolean* | Enable posting images to Cloudinary. `cloudinary.cloudName`, `cloudinary.apiKey`, and `cloudinary.apiSecret` must all be provided if true. 
`cloudinary.cloudName` | `SHOTPUT_CLOUDINARY_CLOUD_NAME` | *string* | [The cloud name](https://cloudinary.com/documentation/how_to_integrate_cloudinary#create_and_tour_your_account) to use when posting to Cloudinary. 
`cloudinary.apiKey` | `SHOTPUT_CLOUDINARY_API_KEY` | *string* | [The API key](https://cloudinary.com/documentation/how_to_integrate_cloudinary#create_and_tour_your_account) to use when posting to Cloudinary. 
`cloudinary.apiSecret` | `SHOTPUT_CLOUDINARY_API_SECRET` | *string* | [The API secret](https://cloudinary.com/documentation/how_to_integrate_cloudinary#create_and_tour_your_account) to use when posting images to Cloudinary. 
`files.enabled` | `SHOTPUT_LOCAL_FILES_ENABLED` | *boolean* | Whether to allow images to be saved and served on the API server itself. `files.directory` and `files.host` must be set if true. 
`files.directory` | `SHOTPUT_LOCAL_FILES_DIRECTORY` *string* | Absolute path to the directory to save images to on the API file system. 
`files.host` | `SHOTPUT_HOST_NAME` | *string* | The host name to use when returning image links to files that are saved locally. 
`customImageUploader.enabled` | `SHOTPUT_CUSTOM_IMAGE_UPLOADER_ENABLED` | *boolean* | If custom image uploading is enabled or not. `customImageUploader.endpoint` must be set if true. 
`customImageUploader.endpoint` | `SHOTPUT_CUSTOM_IMAGE_UPLOAD_URL` | *string* | Endpoint that will do image processing. Must take a JSON body containing 


```
{
    "image": "base64..." // base64 encoded image
}
```

And return a JSON response with `url` containing the url the image has been uploaded to.
 

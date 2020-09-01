---
layout: default
title: Introduction
nav_order: 1
description: "This is a test description"
permalink: /
---

Shotputter is a development tool that helps small to medium-sized teams report bugs and browser errors,
request features and changes, and provide targeted system information for developers via browser screenshots. 
The main feature of Shotputter is to provide a tab/button that the user can click to 
take an annotated screenshot, and then send immediately to the dev team via a (self hosted) API that posts to other services that may be in use.
Current third party implementions are
* Google Chat
* Slack
* Jira
* Github
* Custom webhook

Additionally for screenshot image hosting, the providers are
* Local filesystem (from the API)
* AWS S3
* Imgur
* Cloudinary
 

For particularly small teams or if hosting the API proves to be challenging, good old fashion
downloads and copy/paste system information is also available for configuration.

To quickly start the API server, a CLI, Docker deployment, and Serverless configuration for use on AWS.
A Cloudformation file for an ECS deployment is also provided.

## When should I use this?

Shotputter is designed to be an easy-to-use dev tool for small projects and teams before
moving on to more robust implementations such as [Rollbar](https://rollbar.com) or [usersnap](https://usersnap.com).

Shotputter is *NOT* recommended for production environments! It should only be used on a development or
staging environment. The main concern is security when interfacing with the API. Future revisions will
try to address these issues.

It is possible to set up Shotputter in your development environment to [be more friendly for non-technical users to use](#non-technical-users) 

## Getting started

Shotputter is distributed through NPM, and you can install it the usual NPM way.

```$xslt
npm install shotputter
```  

1) When it's installed, unless you are only using the download feature demonstrated
here, you will need to launch/host an API server somewhere. [Details on how to launch an server can be found here](/api-server)
2) With an API server running somewhere in your browser code, you will need to initialize 
the `Shotput` object. An example of which is below: 
```
const {Shotput} = require("shotputter");
Shotput({
    service: {
        url: "https://my-shotput-api.example.com"
    },
    captureLogs: true,
    errorReporting: {
        enabled: true,
        slack: {
            enabled: true,
            channel: "errors"
        }
    }
    github: {
        enabled: true,
        defaultOwner: "adamsar",
        defaultRepo: "shotputter"
    },
    slack: {
      enabled: true,
      defaultChannel: "dev"
    },           
    jira: {
        enabled: true,
        defaultIssueType: "Bug"
    }
});
```
you can read more about configuring the application in the [browser configuration section of this page](#browser-configuration).
3. Start your application, use the feedback tab on the right side of the page to begin using the application.

## Browser configuration

The Shotput object on the browser has the following options configurable.
To just use the download feature or a custom endpoint with no server, initialize a Shotput object with `service` set to *false*.

```
const {Shotput} = require("shotputter");
Shotput({service: false});
```

* `service.url` *string* URL where the [shotput api service](/api-service) is running.
* `service.messageTemplate` *string \| function* Override default [template](/shotputter/templates) when posting a message to a service.
* `service.autoPost` *boolean* Enable [auto posting](#non-technical-users) when submitting screenshots or messages. Default *false*
* `service.autoPostFirst` *boolean* Posts to endpoints that are configured as [auto post](#non-technical-users) immediately instead of prompting a post. Default *false*
* `metadata` *object* Set initial [metadata](/shotputter/#metadata) to include in information when submitting screenshots. Useful for adding app-specific data such as current user, etc. Default *undefined*
* `captureLogs` *boolean* Capture logs (up to 20 lines) to include in reports. Default *false* 
* `errorReporting.enabled` *boolean* Enable capturing of errors in the browser (and rejected promises) and report them as per additional configuration in the object. Defaults to *false*
* `errorReporting.slack.enabled` *boolean* Send errors to slack, requires the `errorReporting.slack.channel` option to be set if set to to true. Default *false*
* `errorReporting.slack.channel` *string* Which slack channel to post browser errors to.
* `errorReporting.slack.template` *string \| function* Change the default [template](/shotputter/templates) to use when posting errors to Slack.  
* `errorReporting.google.enabled` *boolean* Post errors to Google chats. Defualts to *false*;
* `errorReporting.google.template` *string \| function* Change the default [template](/shotputter/templates) when posting errors to Google Chats.
* `errorReporting.customEndpoint` *string* Send errors to a custom endpoint. The endpoint must accept a *POST* request with the following JSON body (depending on what is configured)   

```
{
    type: "page_error",
    payload: {
        message: "Stack trace\n", // Stack trace of the error occurred
        systemInfo: {}, // All system info obtained from the browser
        metadata: {}, // Any metadata that is set
        logs: [] // If `captureLogs` is enabled, this will be an array of the last 20 log messages.
    },

}
```

* `errorReporting.template` *string \| function* Change the default template for all error reporting endpoints.
* `download.enabled` *boolean* Set to *false* to explicitly disable the Download option.
* `slack.enabled` *boolean* Enable posting screenshots and messages to slack.
* `slack.defaultChannel` *string* Name or ID of channel to post screenshots to by default. If `slack.forceChannel` is not set to true, it will be possible to change channels when posting manually.
* `slack.forceChannel` *boolean* When set to *true* with a channel provided via `slack.defaultChannel`, this will force all messages to only post to the specified channel.
* `slack.template` *string \| function* Change the default [template](/shotputter/templates) when posting to Slack.
* `slack.autoPost` *boolean* Automatically post to slack when using the [auto posting](#non-technical-users) feature. Requires `slack.defaultChannel` to also be configured.
* `google.enabled` *boolean* Posting to Google Chats is enabled.
* `google.template` *string \| function* Change the default [template](/shotputter/templates) when posting to Google Chats.
* `google.autoPost` *boolean* Automatically post to slack when using the [auto posting](#non-technical-users) feature.
* `github.enabled` *boolean* Posting to Github is enabled. 
* `github.template` *string \| function* Change the default [template](/shotputter/templates) when posting to Github.
* `github.titleTemplate` *string \| function* Change the default [template](/shotputter/templates) for the issue title when posting to Github. It is recommended to set this when auto posting to Github.
* `github.defaultOwner` *string* Automatically set the default Github owner when listing repos from Github. When used with [auto posting](#non-technical-users) via `github.autoPost` this must be set with `github.defaultRepo`.
* `github.defaultRepo` *string* Automatically set the default Github repo when listing repos from Github. When used with [auto posting](#non-technical-users) via `github.autoPost` this must be set with `github.defaultOwner`.
* `github.forceRepo` *boolean* Force posts to automatically to a specific repo for a specific owner. This will disable being able to select a repo. `github.defaultRepo` and `github.defaultOwner` must be set with this.
* `github.defaultLabels` *array<string>* Set default labels for each post on Github.
* `github.autoPost` *boolean* Include Github when [auto posting](#non-technical-users). Requires `github.defaultOwner` and `github.defaultRepo` to also be set. `github.titleTemplate` strongly recommended to also be set. 
* `jira.enabled` *boolean* Enabled posting to Jira.
* `jira.template` *string \| function* Change the default [template](/shotputter/templates) for posting to Jira.
* `jira.defaultProject` *string* Default project to select for posting, name or ID. Use with `jira.forceProject` to remove the option to select different projects. Required when using the [auto posting](#non-technical-user) feature and `jira.autoPost`
* `jira.forceProject` *boolean* Use with `jira.defaultProject` to force the user to use only a specific Jira Project.
* `jira.defaultIssueType` *string* Default issue type to use when posting issues; ID or name permitted. Make sure this issue type exists on the default project, and use `jira.forceIssueType` to force the user to only use this issue type. Required when using the [auto posting](#non-technical-user) feature and `jira.autoPost`
* `jira.defaultSummary` *string* Default summary to use for issues posted to jira. Recommended when using the [auto posting](#non-technical-user) feature and `jira.autoPost`.
* `jira.defaultPriority` *string* PriorityId or name. Required when using the [auto posting](#non-technical-user) feature/`jira.autoPost` and the issue type used requires a priority.
* `jira.autoPost` *boolean* Include jira in [auto posting](#non-technical-user). Requires `jira.defaultProject` and `jira.defaultIssueType` to also be set, and `jira.defaultPriority` if required, and `jira.defaultSummary` is also recommended to be used.
* `custom.enabled` *boolean* Enabled posting screenshots to a custom webhook. `custom.endpoint` required when enabled
* `custom.endpoint` *string* Endpoint to post screenshots and system information to. The endpoint must handle a POST request with the following JSON body

```
{
    type: "screenshot_post",
    payload: {
        logs: [], // array of log strings
        image: "", //Base64 encoded screenshot
        systemInfo: {}, // Object containing browser and system information
        metadata: {} // Metadata provided for the current environment is any.
    },
    timestamp: "2020-09-01T04:44:50.283Z" // ISO string for when the post request was made
}
```

## Metadata

Since Shotputter is designed to help get developers the information they need to make
the changes their test users want, sometimes additional data about the user or their actions would help. Metadata can be provided or changed
for use in [templates](/shoputter/templates) through the [browser configuration](/shotputter/#browser-configuration) and a small interface on the Shotput instance that is created.

Example:
```
const {Shotput} = require("shotputter");
const instance = Shotput({
...config,
metadata: {
    userName: getUserName()
}
});

///... later in the application
instance.updateMetadata({
    groups: ["test", "test1"]
});
```

These functions are available on the Shotput instance to manipulate metadata.

* `updateMetadata(metadata: object)` Updates existing metadata with the object provided. Overwrites existing keys.
* `setMetadata(metadata: object)` Completely replaces the existing metadata with the new object. All existing data is deleted.
* `purgeMetadata()` Sets the metadata object to a blank object   

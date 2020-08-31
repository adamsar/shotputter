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
These third party service include Slack, Github, Google Chat, etc. 

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
To just use the download feature with no server, intialize a shotput object with `service` set to false.

```
const {Shotput} = require("shotputter");
Shotput({service: false});
```

* `service.url` *string* URL where the [shotput api service](/api-service) is running.
* `service.messageTemplate` *string \| function* Override default [template](/templates) when posting a message to a service.
* `service.autoPost` *boolean* Enable [auto posting](#non-technical-users) when submitting screenshots or messages. Default *false*
* `service.autoPostFirst` *boolean* Posts to endpoints that are configured as [auto post](#non-technical-users) immediately instead of prompting a post. Default *false*
* `metadata` *object* Set initial [metadata](/metadata) to include in information when submitting screenshots. Useful for adding app-specific data such as current user, etc. Default *undefined*
* `captureLogs` *boolean* Capture logs (up to 20 lines) to include in reports. Default *false* 
* `errorReporting.enabled` *boolean* Enable capturing of errors in the browser (and rejected promises) and report them as per additional configuration in the object. Defaults to *false*
* `errorReporting.slack.enabled` *boolean* Send errors to slack, requires the `errorReporting.slack.channel` option to be set if set to to true. Default *false*
* `errorReporting.slack.channel` *string* Which slack channel to post browser errors to.
* `errorReporting.` 

  

---
layout: default
title: Templates
nav_order: 1
description: "Template usage in shotputter"
permalink: /templates
---

# Templates

To post to the various services that it supports, Shotputter uses [handlebars templates](https://handlebarsjs.com/) that are
specified in the [browser configuration](/shotputter/#browser-configuration). These templates can be either
a string, or a function that returns a string, which has access to the following variables.

* `logs` *array of string* Logs if enabled by the `captureLogs` setting in the [browser configuration](/#browser-configuration).
* `logsString` *string* Logs concatenated as a single string with new lines bewtween.
* `metadata` *object* Any [metadata](/shotputter/#metadata) that was provided by the user.
* `metadataString` *string* JSON.stringified metadata if provided
* `systemInfo` *object* System information such as screen size, browser, etc.
* `systemInfoString` *string* JSON.stringified systemInfo.
* `message` *string* The message that was typed in by the user taking the screenshot.

Ex:

```$xslt
const {Shotput} = require("shotputter");
Shotput({
    service: {
        "url": "https://api.example.com",
        "template": `
        {{ metadata.userName }} reported this issue on the page {{ systemInfo.url }} 
        {{ message }}
        `
    }
});
```

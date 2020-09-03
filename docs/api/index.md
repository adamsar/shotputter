---
layout: default
title: Api services
nav_order: 3
description: "Template usage in shotputter"
permalink: /api
---

Below are several ways to get the API serving content. After getting an API running, you will need to replace
the `service.endpoint` config parameter in the [browser config](/shotputter/#browser-configuration) with the url that will 
allow access to it. For example, if you are running the server locally on port 2000 while developing, you can change the service URL to 
`http://localhost:2000`. 

## Run via CLI

You can install the cli server globally. 
```$xslt
npm install -g @shotput/api
```

or locally 
```$xslt
npm install @shotput/api
``` 

If you installed it globally, you can simply start up the server with

```$xslt
shotput-server --port {port} --config {config file}
```

While locally, you will need to use the node_modules directory


```$xslt
node node_modules/@shotputter/api/dist/shotput-server.js --port {port} --config {config file}
```

The options for running the cli are

* `port` *integer*  What port to run on
* `configFile` *file reference* Which [config file](/shotputter/server-configuration) to use when running to API server.

## Docker 

Shotputter provides docker [image to Docker hub](https://hub.docker.com/repository/docker/adamsar/shotputter) to run the api server. The 
docker container is a wrapper for the [cli](/shotputter/api#run-via-cli) and can be [configured](/shotputter/server-configuration) the same with - with a file or environment variables.

An example for running the docker container if there is a "config.json" in the current working directory.

```$xslt
docker run -d -p 3000:3000 --mount type=bind,source="$(pwd)",target=/opt/app/configuration adamsar/shotputter --configFile /opt/app/configuration/config.json
```
 
## AWS Serverless

Shotputter is bundled with a [serverless](https://serverless.com) file to help bootstrap an AWS Lambda and AWS S3 
centered deployment. This file is available in the `node_modules/@shotputter/api/serverless-example.yml` folder if installing locally,
or [on Github](https://github.com/adamsar/shotputter/blob/master/packages/api/src/main/serverless/serverless-example.yml)

To run this file, you will need to set the [appropriate configuration environment variables](/shotputter/server-configuration).

To use s3 to host the images that Shotput will write, edit the iamRoleStatements section of the serverless file and replace S3_BUCKET with the bucket you would like to write to (ensure this bucket has public read permissions).

Alternatively you can provide your own iamRole in the serverless file that can access S3.

     

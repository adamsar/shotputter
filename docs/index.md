---
layout: default
title: Introduction
nav_order: 1
description: "This is a test description"
permalink: /
---

Shotputter is a development tool that helps small to medium-sized teams report bugs,
request features and changes, and provide targeted system information for developers via browser screenshots. 
The main feature of Shotputter is to provide a tab/button that the user can click to 
take an annotated screenshot, and then send immediately to the dev team via a (self hosted) API that posts to other services that may be in use.
These third party service include Slack, Github, Google Chat, etc. 

For particularly small teams or if hosting the API proves to be challenging, good old fashion
downloads and copy/paste system information is also available for configuration.

For quick API setup, a CLI deployment, Docker deployment, and Serverless configuration for use on AWS.
A cloudformation file for a ECS deploy is also provided.

## When should I use this?

Shotputter is designed to be the easy-to-use dev tool for small projects and teams before
moving on to more robust implementations such as Rollbar or Usersnap.

It's not recommended for production environments! It should only be used on a development or
staging environment.

## Getting started

Quick start.

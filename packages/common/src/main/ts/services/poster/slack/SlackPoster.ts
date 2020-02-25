import {Poster} from "../Poster";
import {Post} from "../Post";
import {PostResult} from "../PostResult";
import { WebClient } from '@slack/web-api';
import {base64ToBlob} from "base64-blob";

export interface SlackConfiguration {

    token: string;
    channel: string;

}

export interface SlackChannel {

    name: string;
    id: string;

}

export interface SlackServiceClient {
    uploadFile: (channels: string, message: string, fileName: string, base64File: string) => Promise<PostResult>;
    listChannels: () => Promise<SlackChannel[]>;
}

export const HostedSlackService = (serviceUrl: string): SlackServiceClient => {
    return {
        listChannels: async () => {
                const repos: any = await (await fetch(`${serviceUrl}/slack/channels`, {method: "GET"})).json();
                return repos['channels'];
        },
        uploadFile: async (channels: string, message: string, fileName: string, base64File: string) => {
            try {
                await fetch(`${serviceUrl}/slack/post`, {
                    method: "POST",
                    body: JSON.stringify({
                        channels,
                        message,
                        image: base64File,
                        filename: fileName
        ***REMOVED***),
                    headers: {
                        "Content-Type": "application/json"
        ***REMOVED***
    ***REMOVED***);
***REMOVED***  catch (error) {
                return { error }
***REMOVED***
        }

    }
};

export const SlackService = (slackToken: string): SlackServiceClient => {
    const client = new WebClient(slackToken);

    return {
        uploadFile: async (channels: string, message: string, fileName: string, base64File: string): Promise<PostResult> => {
            try {
                const formData = new FormData();
                formData.append("channels", channels);
                formData.append("initial_comment", message);
                formData.append("filename", fileName);
                formData.append("token", slackToken);
                formData.append("file", await base64ToBlob(base64File));
                const result = await fetch("https://slack.com/api/files.upload", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data"
        ***REMOVED***
    ***REMOVED***).then((x: any) => x.json());

                console.log(result);
                if (result.error) {
                    return { error: result.error };
    ***REMOVED*** else {
                    return true;
    ***REMOVED***

***REMOVED*** catch (error) {
                return { error };
***REMOVED***
        },

        listChannels: async (): Promise<SlackChannel[]> => {
            const result = await client.channels.list();
            // @ts-ignore
            return result["channels"];
        }

    };
};

export type SlackPoster = Poster & {setChannel: (channel: string) => void;};

export const SlackPoster = (slackConfiguration: SlackConfiguration | { url: string }): SlackPoster  => {
    const service = "url" in slackConfiguration ? HostedSlackService(slackConfiguration.url) : SlackService(slackConfiguration.token);
    let channel = "channel" in slackConfiguration ? slackConfiguration.channel : undefined;
    return {

        typeName: "slack",

        setChannel: (_channel: string) => {
          channel = _channel;
        },

        send: (post: Post): Promise<PostResult> => {
            return service.uploadFile(channel, post.message || "Screenshot upload", `ScreenShot${new Date().toISOString()}.jpg`, post.image);
        }
    };
};


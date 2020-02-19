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
    client: WebClient;
}

export const SlackService = (slackToken: string): SlackServiceClient => {
    const client = new WebClient(slackToken);

    return {
        client,
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
                    body: formData
                }).then((x: any) => x.json());

                if (result.error) {
                    return { error: result.error };
                } else {
                    return true;
                }

            } catch (error) {
                return { error };
            }
        },

        listChannels: async (): Promise<SlackChannel[]> => {
            const result = await client.channels.list();
            // @ts-ignore
            return result["channels"];
        }

    };
};

export type SlackPoster = Poster & {setChannel: (channel: string) => void;};

export const SlackPoster = (slackConfiguration: SlackConfiguration): SlackPoster  => {
    const service = SlackService(slackConfiguration.token);

    return {

        typeName: "slack",

        setChannel: (channel: string) => {
          slackConfiguration.channel = channel;
        },

        send: (post: Post): Promise<PostResult> => {
            return service.uploadFile(slackConfiguration.channel, post.message || "Screenshot upload", `ScreenShot${new Date().toISOString()}.jpg`, post.image);
        }
    };
};


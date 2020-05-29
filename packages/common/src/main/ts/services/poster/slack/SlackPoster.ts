import {PostResult} from "../PostResult";
import {WebClient} from '@slack/web-api';
import {base64ToBlob} from "base64-blob";
import {chain, fromIOEither, left, map, mapLeft, right, taskEither, TaskEither} from "fp-ts/lib/TaskEither";
import {pipe} from "fp-ts/lib/pipeable";
import {promiseToTaskEither, taskEitherExtensions} from "../../../util/fp-util";
import {HostedRequester, HttpError, postRequest} from "../../HostedRequester";
import {tryCatch} from "fp-ts/lib/IOEither";
import {sequenceT} from "fp-ts/lib/Apply";

export type SlackError = { error: string; type: "unknown" } | HttpError;
const mapError = mapLeft<string, SlackError>((error: string) => ({error, type: "unknown"}))

export interface SlackConfiguration {

    token: string;

}

export interface SlackChannel {

    name: string;
    id: string;

}

export interface SlackServiceClient {

    uploadFile: ({channels, message, fileName, base64File}: { channels: string[], message: string, fileName: string, base64File: string }) => TaskEither<SlackError, PostResult>;
    listChannels: () => TaskEither<SlackError, SlackChannel[]>;

}

export const HostedSlackService = (requester: HostedRequester): SlackServiceClient => {

    return {
        listChannels: () => {
            return pipe(
                requester.get<any>("/slack/channels"),
                map(repos => repos['channels'] as SlackChannel[])
            )
        },

        uploadFile: ({channels, message, fileName, base64File}: { channels: string[], message: string, fileName: string, base64File: string }): TaskEither<SlackError, PostResult> => {
            return requester.post<PostResult>("/slack/post", {
                    channels,
                    message,
                    image: base64File,
                    filename: fileName
***REMOVED***);
        }

    }
};

export const SlackService = (slackToken: string): SlackServiceClient => {
    const client = new WebClient(slackToken);

    return {
        uploadFile: ({channels, message, fileName, base64File}: { channels: string[], message: string, fileName: string, base64File: string }): TaskEither<SlackError, PostResult> => {
            return pipe(
                sequenceT(taskEither)(
                    fromIOEither(
                        tryCatch<string, FormData>(() => {
                            const formData = new FormData();
                            formData.append("channels", channels.join(","));
                            formData.append("initial_comment", message);
                            formData.append("filename", fileName);
                            formData.append("token", slackToken);
                            return formData;
        ***REMOVED*** String)
                    ),
                    promiseToTaskEither(base64ToBlob(base64File))
                ),
                map(([formData, blob]) => {
                    formData.append("file", blob);
                    return formData
    ***REMOVED***),
                mapError,
                chain(formData => postRequest<any>("https://slack.com/api/files.upload", formData)),
                chain(result => result['error'] ? left({type: "unknown", error: result['error'] as string}) : right(true))
            )
        },

        listChannels(): TaskEither<SlackError, SlackChannel[]> {
            return pipe(
                taskEitherExtensions.fromPromise(client.channels.list()),
                map(result => result["channels"] as SlackChannel[]),
                mapError
            )
        }

    };
};

import {PostResult} from "../PostResult";
import {WebAPICallResult, WebClient} from '@slack/web-api';
import {
    chain,
    fromIOEither,
    fromPredicate,
    left,
    map,
    mapLeft,
    right,
    taskEither,
    TaskEither
} from "fp-ts/lib/TaskEither";
import {pipe} from "fp-ts/lib/pipeable";
import {promiseToTaskEither, taskEitherExtensions} from "../../../util/fp-util";
import {HostedRequester, HttpError, postRequest} from "../../HostedRequester";
import {tryCatch} from "fp-ts/lib/IOEither";
import {sequenceT} from "fp-ts/lib/Apply";

export type SlackError = { error: string; type: "unknown" } | HttpError;
export const mapSlackError = mapLeft<string, SlackError>((error: string) => ({error, type: "unknown"}))

export interface SlackConfiguration {

    token: string;

}

export interface SlackChannel {

    name: string;
    id: string;

}

export type SlackPostMessageParams = {
    message: string;
    channel: string;
};

export interface SlackServiceClient {

    postMessage: ({message, channel}: SlackPostMessageParams) => TaskEither<SlackError, true>
    uploadFile: ({channels, message, fileName, base64File}: { channels: string[], message: string, fileName: string, base64File: string }) => TaskEither<SlackError, PostResult>;
    listChannels: () => TaskEither<SlackError, SlackChannel[]>;

}

export const HostedSlackService = (requester: HostedRequester): SlackServiceClient => {

    return {

        postMessage: ({message, channel}) => {
            return pipe(
                requester.post<any>("/slack/postMessage", {
                    message,
                    channel
                }),
                map(_ => true)
            )
        },

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
            });
        }

    }
};

export const SlackService = (slackToken: string): SlackServiceClient => {
    const client = new WebClient(slackToken);

    return {
        postMessage: ({message: text, channel}) => {
            return pipe(
                taskEitherExtensions.fromPromise(client.chat.postMessage({
                    text,
                    channel
                })),
                mapSlackError,
                chain((result: WebAPICallResult) => {
                    if (result.ok) {
                        return right(true)
                    } else {
                        return left({type: "unknown", error: result.error})
                    }
                })
            )
        },

        uploadFile: ({channels, message, fileName, base64File}: { channels: string[], message: string, fileName: string, base64File: string }): TaskEither<SlackError, PostResult> => {
            return pipe(
                sequenceT(taskEither)(
                    fromIOEither(
                        tryCatch<string, FormData>(() => {
                            const formData = new window.FormData();
                            formData.append("channels", channels.join(","));
                            formData.append("initial_comment", message);
                            formData.append("filename", fileName);
                            formData.append("token", slackToken);
                            return formData;
                        }, String)
                    ),
                    promiseToTaskEither(fetch(base64File).then(x => x.blob()))
                ),
                map(([formData, blob]) => {
                    formData.append("file", blob);
                    return formData
                }),
                mapSlackError,
                chain(formData => postRequest<any>("https://slack.com/api/files.upload", formData)),
                chain(result => result['error'] ? left({type: "unknown", error: result['error'] as string}) : right(true))
            )
        },

        listChannels(): TaskEither<SlackError, SlackChannel[]> {
            return pipe(
                taskEitherExtensions.fromPromise(client.channels.list()),
                mapSlackError,
                chain(fromPredicate((result) => result.ok, (result: WebAPICallResult): SlackError => ({type: "unknown", error: result.error}))),
                map(result => result["channels"] as SlackChannel[])
            );
        }

    };
};


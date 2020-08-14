import {PostResult} from "@shotputter/common/src/main/ts/services/poster/PostResult";
import {
    mapSlackError,
    SlackError,
    SlackService,
    SlackServiceClient
} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {WebClient} from '@shotputter/common/node_modules/@slack/web-api';
import {pipe} from "fp-ts/lib/pipeable";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {chain, left, right, TaskEither} from "fp-ts/lib/TaskEither";

export const NativeSlackService = (slackToken: string): SlackServiceClient => {
    const client = new WebClient(slackToken);
    const regularService = SlackService(slackToken)

    return <SlackServiceClient>{
        postMessage: regularService.postMessage,

        uploadFile: ({channels, message, fileName: filename, base64File}: { channels: string[], message: string, fileName: string, base64File: string }): TaskEither<SlackError, PostResult> => {
            return pipe(
                taskEitherExtensions.fromPromise(client.files.upload({
                    file: Buffer.from(base64File, "base64"),
                    initial_comment: message,
                    channels: channels.join(","),
                    filename
                })),
                mapSlackError,
                chain(result => result.error ? left({
                    type: "unknown",
                    error: result.error
                }) : right(true))
            )
        },

        listChannels: regularService.listChannels

    };
};


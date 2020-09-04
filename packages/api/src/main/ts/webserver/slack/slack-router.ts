import * as express from "express";
import {SlackPostMessageParams} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {imageValidator, messageValidator} from "../validators/post-validators";
import {SlackServerConfig} from "../server";
import {channelValidator} from "../validators/slack-validators";
import {route} from "../routing/route";
import {expressValidateToErrorResponse} from "../routing/response-errors";
import {EitherAsync, Left, Right} from "purify-ts";
import {Posted} from "../routing/StandardResponses";
import {BadResponse, Ok, ServerError} from "../routing/responses";
import {WebClient} from '@shotputter/common/node_modules/@slack/web-api';
import {isLeft} from "fp-ts/lib/Either";
import {NativeSlackService} from "./NativeSlackService";

export interface SlackPostRequest {
    image: string;
    channels?: string[];
    message?: string;
}

export const slackRouter = (slackServerConfig: SlackServerConfig): express.Router => {
    const router = express.Router({});
    const slackService = NativeSlackService(slackServerConfig.token);
    const web: WebClient = new WebClient(slackServerConfig.token);

    router.post("/post", [
        messageValidator,
        imageValidator,
        channelValidator(true)
    ], route(({req}) => {
        return expressValidateToErrorResponse<SlackPostRequest>(req)
            .chain((postRequest) => EitherAsync(async ({liftEither}) => {

                await web.files.upload({
                    channels: postRequest.channels.join(","),
                    filename: `Screenshot-${new Date().toISOString()}.png`,
                    // @ts-ignore
                    file: Buffer.from(postRequest.image.replace("data:image/png;base64,", ""), "base64"),
                    initial_comment: postRequest.message
    ***REMOVED***);

               return liftEither(Right(Posted));
***REMOVED***));
    }));

    router.get("/channels", route(({}) => EitherAsync(async ({liftEither}) => {
        const channels = await slackService.listChannels()();
        if (isLeft(channels)) {
            return liftEither(Left(BadResponse({error: "server", message: JSON.stringify(channels.left)})))
        }
        return liftEither(Right(Ok({channels: channels.right})));
    })));

    router.post("/postMessage", [
        messageValidator,
        channelValidator
    ], route(({req}) => {
        return expressValidateToErrorResponse<SlackPostMessageParams>(req)
            .chain((post) => EitherAsync(async ({liftEither}) => {
                const response = await slackService.postMessage(post)()
                if (isLeft(response)) {
                    return liftEither(Left(ServerError({error: "server", message: JSON.stringify(response.left)})));
    ***REMOVED*** else {
                    return liftEither(Right(Posted))
    ***REMOVED***
***REMOVED***));
    }))

    return router;
};


import * as express from "express";
import {SlackService} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {imageValidator, messageValidator} from "../validators/post-validators";
import {SlackServerConfig} from "../server";
import {channelValidator} from "../validators/slack-validators";
import {route} from "../routing/route";
import {expressValidateToErrorResponse} from "../routing/response-errors";
import {EitherAsync, Right} from "purify-ts";
import {Posted} from "../routing/StandardResponses";
import {Ok} from "../routing/responses";

export interface SlackPostRequest {
    image: string;
    channel?: string;
    message?: string;
}

export const slackRouter = (slackServerConfig: SlackServerConfig): express.Router => {
    const router = express.Router({});
    const slackService = SlackService(slackServerConfig.clientId);

    router.post("/post", [
        messageValidator,
        imageValidator,
        channelValidator(slackServerConfig.defaultChannel !== undefined)
    ], route(({req}) => {
        return expressValidateToErrorResponse<SlackPostRequest>(req)
            .chain((postRequest) => EitherAsync(async ({liftEither}) => {
               await slackService.uploadFile(postRequest.channel || slackServerConfig.defaultChannel, postRequest.message || "", `Screenshot-${new Date().toISOString()}.jpg`, postRequest.image);
               return liftEither(Right(Posted));
***REMOVED***));
    }));

    router.get("/channels", route(({}) => EitherAsync(async ({liftEither}) => {
        const channels = await slackService.listChannels();
        return liftEither(Right(Ok({channels})));
    })));

    return router;
};


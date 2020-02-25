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
//import axios from "axios";
import { WebClient } from '@shotputter/common/node_modules/@slack/web-api';


export interface SlackPostRequest {
    image: string;
    channels?: string;
    message?: string;
}

export const slackRouter = (slackServerConfig: SlackServerConfig): express.Router => {
    const router = express.Router({});
    const slackService = SlackService(slackServerConfig.clientId);
    const web: WebClient = new WebClient(slackServerConfig.clientId);

    router.post("/post", [
        messageValidator,
        imageValidator,
        channelValidator(slackServerConfig.defaultChannel !== undefined)
    ], route(({req}) => {
        return expressValidateToErrorResponse<SlackPostRequest>(req)
            .chain((postRequest) => EitherAsync(async ({liftEither}) => {
                const result = await web.files.upload({
                    channels: postRequest.channels || slackServerConfig.defaultChannel,
                    filename: `Screenshot-${new Date().toISOString()}.jpg`,
                    // @ts-ignore
                    file: Buffer.from(postRequest.image.replace("data:image/png;base64,", ""), "base64"),
                    initial_comment: postRequest.message
    ***REMOVED***);

               return liftEither(Right(Posted));
***REMOVED***));
    }));

    router.get("/channels", route(({}) => EitherAsync(async ({liftEither}) => {
        const channels = await slackService.listChannels();
        return liftEither(Right(Ok({channels})));
    })));

    return router;
};


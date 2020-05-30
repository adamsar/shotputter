import * as express from "express";
import {SlackService} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {imageValidator, messageValidator} from "../validators/post-validators";
import {SlackServerConfig} from "../server";
import {channelValidator} from "../validators/slack-validators";
import {route} from "../routing/route";
import {expressValidateToErrorResponse} from "../routing/response-errors";
import {EitherAsync, Left, Right} from "purify-ts";
import {Posted} from "../routing/StandardResponses";
import {BadResponse, Ok} from "../routing/responses";
//import axios from "axios";
import { WebClient } from '@shotputter/common/node_modules/@slack/web-api';
import {isLeft} from "fp-ts/lib/Either";


export interface SlackPostRequest {
    image: string;
    channels?: string[];
    message?: string;
}

export const slackRouter = (slackServerConfig: SlackServerConfig): express.Router => {
    const router = express.Router({});
    const slackService = SlackService(slackServerConfig.clientId);
    const web: WebClient = new WebClient(slackServerConfig.clientId);

    router.post("/post", [
        messageValidator,
        imageValidator,
        channelValidator(true)
    ], route(({req}) => {
        return expressValidateToErrorResponse<SlackPostRequest>(req)
            .chain((postRequest) => EitherAsync(async ({liftEither}) => {
                console.log(JSON.stringify({
                    channels: postRequest.channels,
                    filename: `Screenshot-${new Date().toISOString()}.jpg`,
                    // @ts-ignore
                    file: Buffer.from(postRequest.image.replace("data:image/png;base64,", ""), "base64"),
                    initial_comment: postRequest.message
                }));
                const result = await web.files.upload({
                    channels: postRequest.channels.join(","),
                    filename: `Screenshot-${new Date().toISOString()}.jpg`,
                    // @ts-ignore
                    file: Buffer.from(postRequest.image.replace("data:image/png;base64,", ""), "base64"),
                    initial_comment: postRequest.message
                });
                console.log(result);

               return liftEither(Right(Posted));
            }));
    }));

    router.get("/channels", route(({}) => EitherAsync(async ({liftEither}) => {
        const channels = await slackService.listChannels()();
        if (isLeft(channels)) {
            return liftEither(Left(BadResponse({error: "server", message: JSON.stringify(channels.left)})))
        }
        return liftEither(Right(Ok({channels: channels.right})));
    })));

    return router;
};


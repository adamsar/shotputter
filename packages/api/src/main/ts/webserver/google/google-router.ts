import * as express from "express";
import {_route} from "../routing/route";
import {pipe} from "fp-ts/lib/pipeable";
import {ioUtils} from "@shotputter/common/src/main/ts/util/io-utils";
import {googlePostDecoder} from "@shotputter/common/src/main/ts/services/poster/google/GooglePoster";
import {ServerError} from "../routing/responses";
import {BadDecodeResponse} from "../routing/response-errors";
import {chain, map, mapLeft} from "fp-ts/lib/TaskEither";
import {Posted} from "../routing/StandardResponses";
import {HostedRequester} from "@shotputter/common/src/main/ts/services/HostedRequester";
import {ImageUploader} from "@shotputter/common/src/main/ts/services/images/uploader";

const cardFormat = (imageUrl: string, message: string) => ({
    cards: [{
        sections: [{
            widgets: [
                {image: { imageUrl }},
                {textParagraph: {text: message}},
                {buttons: {textButton: {
                            text: "View screenshot",
                            onClick: {"openLink": {"url": imageUrl}}}}}
            ]
        }]
    }]
});



export const googleRouter = (webhookUrl: string, imageUploader: ImageUploader): express.Router => {

    const requester = new HostedRequester(webhookUrl);

    const router = express.Router();

    router.post("/post", _route(({req}) => {
        return pipe(
            ioUtils.toTaskEither(req.body, googlePostDecoder, BadDecodeResponse),
                chain(({message, image}) => pipe(
                    imageUploader.uploadImage(image),
                    mapLeft(error => ServerError(error)),
                    chain(imageUrl => pipe(
                        requester.post("", cardFormat(imageUrl, message)),
                        mapLeft(error => ServerError(error))
                    ))
                )),
            map(_ => Posted)
        )
    }));

    return router;
}

import * as express from "express";
import { google } from "googleapis"
import {_route} from "../routing/route";
import {pipe} from "fp-ts/lib/pipeable";
import {ioUtils} from "@shotputter/common/src/main/ts/util/io-utils";
import {
    googlePostDecoder,
    GooglePoster$Post$Params
} from "@shotputter/common/src/main/ts/services/poster/google/GooglePoster";
import {BadResponse, Ok} from "../routing/responses";
import {BadDecodeResponse} from "../routing/response-errors";
import {chain, left, mapLeft, right} from "fp-ts/lib/TaskEither";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {Posted} from "../routing/StandardResponses";

export const googleRouter = (auth: string): express.Router => {
    const googleApi = google.chat({
        version: "v1",
        auth
    });
    const router = express.Router();

    router.post("/post", _route(({req}) => {
        return pipe(
            ioUtils.toTaskEither(req.body, googlePostDecoder, BadDecodeResponse),
            chain(({image, message, space, thread}: GooglePoster$Post$Params) => pipe(
                taskEitherExtensions.fromPromise(
                    googleApi.spaces.messages.create({
                                parent: space,
                                threadKey: thread,
                                requestBody: {
                                    cards: [
                                        {
                                            sections: [
                                                {
                                                    header: "Shotput screenshot",
                                                    widgets: [{
                                                        image: {
                                                            imageUrl: image
                                                        },
                                                        textParagraph: {text: message}
                                                    }]

                                                }
                                            ]
                                        }
                                    ]
                                }
                            })
                ),
                mapLeft((message) => BadResponse({error: "server", message}))
                )
            ),
            chain(response => {
                if (response.status >= 300) {
                    return right(Posted)
                } else {
                    return left(BadResponse({error: "server", message: JSON.stringify(response.data)}))
                }
            })
        )
    }));

    router.get("/spaces", _route(() => {
       return pipe(
           taskEitherExtensions.fromPromise(
               googleApi.spaces.list()
           ),
           mapLeft(message => BadResponse({error: "server", message})),
           chain(response => {
               if (response.status >= 300) {
                   return left(BadResponse({error: "server", message: JSON.stringify(response.data)}))
               } else {
                   return right(Ok(response.data.spaces))
               }
           })
       )
    }));

    return router;
}

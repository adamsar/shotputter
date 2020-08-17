import * as express from "express";
import {chat_v1, google} from "googleapis"
import {_route} from "../routing/route";
import {pipe} from "fp-ts/lib/pipeable";
import {ioUtils} from "@shotputter/common/src/main/ts/util/io-utils";
import {
    googlePostDecoder,
    GooglePoster$Post$Params
} from "@shotputter/common/src/main/ts/services/poster/google/GooglePoster";
import {BadResponse, HttpResponse, Ok, ServerError} from "../routing/responses";
import {BadDecodeResponse} from "../routing/response-errors";
import {chain, left, map, mapLeft, right, TaskEither} from "fp-ts/lib/TaskEither";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {Posted} from "../routing/StandardResponses";
import {GoogleAuth} from "google-auth-library";
import Chat = chat_v1.Chat;

export const googleRouter = (securityFile: string): express.Router => {

    const clientPromise = new GoogleAuth({keyFile: securityFile, scopes: ["https://www.googleapis.com/auth/chat.bot"]}).getClient().then(auth => {
        auth.request({
            method: 'GET',
            url: "https://chat.googleapis.com/v1"
        }).then(response => console.log(response.data)).catch(x => console.log(x));
        return google.chat({
            auth,
            version: "v1"
        })
    });

    const router = express.Router();

    const getClient: TaskEither<HttpResponse, Chat> = mapLeft((error: string) => ServerError({error}))(taskEitherExtensions.fromPromise(clientPromise));

    router.post("/post", _route(({req}) => {
        return pipe(
            ioUtils.toTaskEither(req.body, googlePostDecoder, BadDecodeResponse),
            chain((params) => pipe(getClient, map(client => [client, params]))),
            chain(([googleApi, {image, message, space, thread}]: [Chat, GooglePoster$Post$Params]) => pipe(
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
                                        ***REMOVED***
                                                        textParagraph: {text: message}
                                        ***REMOVED***]

                                    ***REMOVED***
                                            ]
                            ***REMOVED***
                                    ]
                    ***REMOVED***
                ***REMOVED***)
                ),
                mapLeft((message) => BadResponse({error: "server", message}))
                )
            ),
            chain(response => {
                if (response.status >= 300) {
                    return right(Posted)
    ***REMOVED*** else {
                    return left(BadResponse({error: "server", message: JSON.stringify(response.data)}))
    ***REMOVED***
***REMOVED***)
        )
    }));

    router.get("/spaces", _route(() => {
       return pipe(
           getClient,
           chain((googleApi) => pipe(
               taskEitherExtensions.fromPromise(googleApi.spaces.list()),
               mapLeft(message => BadResponse({error: "server", message})))),
           chain(response => {
               if (response.status >= 300) {
                   return left(BadResponse({error: "server", message: JSON.stringify(response.data)}))
   ***REMOVED*** else {
                   return right(Ok(response.data.spaces))
   ***REMOVED***
           })
       )
    }));

    return router;
}

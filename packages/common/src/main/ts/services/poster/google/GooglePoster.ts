import {HostedRequester, HttpError} from "../../HostedRequester";
import {TaskEither} from "fp-ts/lib/TaskEither";
import * as t from "io-ts";


export interface GooglePoster$Post$Params {

    image: string;  // base64 string;
    message: string;

}

export const googlePostDecoder: t.Type<GooglePoster$Post$Params> = t.strict({

    image: t.string,
    message: t.string

});

export type GoogleError = { type: "google", error: any } | HttpError;

export interface GooglePoster {

    post: (options: GooglePoster$Post$Params) => TaskEither<GoogleError, true>

}

export const HostedGooglePoster = (requester: HostedRequester): GooglePoster => {

    return {

        post(options: GooglePoster$Post$Params): TaskEither<GoogleError, true> {
            return requester.post("/google/post", options);
        }

    }

}

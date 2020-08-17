import {HostedRequester, HttpError} from "../../HostedRequester";
import {TaskEither} from "fp-ts/lib/TaskEither";
import * as t from "io-ts";


export interface GooglePoster$Post$Params {

    image: string;  // base64 string;
    message: string;
    space: string; // Space to post to
    thread?: string

}

export const googlePostDecoder: t.Type<GooglePoster$Post$Params> = t.strict({
    image: t.string,
    message: t.string,
    space: t.string,
    thread: t.union([t.undefined, t.string])
});

export type GoogleError = { type: "google", error: any } | HttpError;

export interface Space {
    /**
     * Output only. The display name (only if the space is a room). Please note that this field might not be populated in direct messages between humans.
     */
    displayName?: string | null;
    /**
     * Resource name of the space, in the form &quot;spaces/*&quot;. Example: spaces/AAAAMpdlehYs
     */
    name?: string | null;
    /**
     * Whether the space is a DM between a bot and a single human.
     */
    singleUserBotDm?: boolean | null;
    /**
     * Whether the messages are threaded in this space.
     */
    threaded?: boolean | null;
    /**
     * Output only. The type of a space. This is deprecated. Use `single_user_bot_dm` instead.
     */
    type?: string | null;
}

export interface GooglePoster {

    post: (options: GooglePoster$Post$Params) => TaskEither<GoogleError, true>
    listSpaces: () => TaskEither<GoogleError, Space[]>;

}

export const HostedGooglePoster = (requester: HostedRequester): GooglePoster => {

    return {

        listSpaces(): TaskEither<GoogleError, Space[]> {
            return requester.get("/google/spaces");
        },
        post(options: GooglePoster$Post$Params): TaskEither<GoogleError, true> {
            return requester.post("/google/post", options);
        }

    }

}

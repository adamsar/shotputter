import {Post} from "../Post";
import {HttpError, postRequest} from "../../HostedRequester";
import {TaskEither} from "fp-ts/lib/TaskEither";
import {SystemInfo} from "../../../models/SystemInfo";

export interface HttpPoster {

    sendPost(post: Post): TaskEither<HttpError, true>;
    sendError(stackTrace: string, systemInfo: SystemInfo, metadata?: object, logs?: string[]): TaskEither<HttpError, true>;

}

export const HttpPoster = (url: string): HttpPoster => {

    const send = <A>(item: { type: string; payload: A}): TaskEither<HttpError, true> => {
        return postRequest(url, item)
    }

    return {
        sendPost: (post) => {
            const payload = {
                type: "screenshot_post",
                payload: post,
                timestamp: new Date().toISOString()
            }
            return send(payload);
        },
        sendError: (stackTrace, systemInfo, metadata, logs) => {
            const payload = {
                type: "page_error",
                payload: {
                    stackTrace,
                    systemInfo,
                    metadata,
                    logs
                },
                timestamp: new Date().toISOString()
            }
            return send(payload);
        }
    }
}

import {Post} from "./Post";
import {PostResult} from "./PostResult";
import {TaskEither} from "fp-ts/lib/TaskEither";
import {taskEither} from "fp-ts";

export type DownloadError = {type: "downloadError", error: string;}
export interface DownloadPoster {
    send(post: Post): TaskEither<DownloadError, PostResult>
}

export const DownloadPoster = (document: Document): DownloadPoster => {
    return {
        send(post: Post): TaskEither<DownloadError, PostResult> {
            return taskEither.tryCatch(() => new Promise((resolve) => {
                const pom = document.createElement('a');
                pom.setAttribute('href', post.image);
                pom.setAttribute('download', `screeshot-${(new Date()).toISOString()}.png`);
                if (document.createEvent) {
                    try {
                        const event = document.createEvent('MouseEvents');
                        event.initEvent('click', true, true);
                        pom.dispatchEvent(event);
                    } catch (error) {
                        pom.click();
                    }
                }
                else {
                    pom.click();
                }
                return resolve(true);
            }), (error: string) => ({error, type: "downloadError"}));
        }
    };

};

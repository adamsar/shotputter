import {Poster} from "./Poster";
import {Post} from "./Post";
import {PostResult} from "./PostResult";

export const DownloadPoster = (document: Document): Poster => {

    return {
        typeName: "download",
        async send(post: Post): Promise<PostResult> {
            try {
                const pom = document.createElement('a');
                pom.setAttribute('href', post.image.replace("image/jpeg", "image/octet-stream"));
                pom.setAttribute('download', `screeshot-${(new Date()).toISOString()}`);

                if (document.createEvent) {
                    const event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    pom.dispatchEvent(event);
    ***REMOVED***
                else {
                    pom.click();
    ***REMOVED***
***REMOVED*** catch (error) {
                return {error};
***REMOVED***
            return true;
        }
    };

};
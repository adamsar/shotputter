import {ImageUploader, ImageUploadError} from "./uploader";
import {HostedRequester} from "../HostedRequester";
import {map, TaskEither} from "fp-ts/lib/TaskEither";
import {pipe} from "fp-ts/lib/pipeable";

export const CustomerImageUploader = (endpoint: string): ImageUploader => {
    const requester = new HostedRequester(endpoint)
    return {
        uploadImage(image: string): TaskEither<ImageUploadError, string> {
            return pipe(
                requester.post<{url: string;}>("", {image}),
                map(response => response.url)
            );
        }
    }
}

import {postRequest} from "../HostedRequester";
import {chain, left, right, TaskEither} from "fp-ts/lib/TaskEither";
import {pipe} from "fp-ts/lib/pipeable";
import {ImageUploader, ImageUploadError} from "./uploader";

export interface ImgurUploader {

    uploadImage(file: string): TaskEither<ImageUploadError, string>;
}

export const ImgurUploader = (clientId: string): ImageUploader => {

    const authorization = {Authorization: `Client-ID ${clientId}`};

    return {
        uploadImage(file: string): TaskEither<ImageUploadError, string> {
            return pipe(
                postRequest<any>("https://api.imgur.com/3/image", {image: file.replace("data:image/png;base64,", "")}, authorization),
                chain(result => {
                    if (!result['success']) {
                        return left({type: "imageUpload", error: JSON.stringify(result)})
        ***REMOVED***
                    return right(result['data']['link']);
    ***REMOVED***)
            )
        }
    };
};

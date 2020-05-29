import {HttpError, postRequest} from "../HostedRequester";
import {chain, left, right, TaskEither} from "fp-ts/lib/TaskEither";
import {pipe} from "fp-ts/lib/pipeable";

export type ImgurError = {type: "imgurError"; error: string;} | HttpError;

export interface ImgurUploader {

    uploadImage: (file: string) => TaskEither<ImgurError, string>;
}

export const ImgurUploader = (clientId: string): ImgurUploader => {

    const authorization = {Authorization: `Client-ID ${clientId}`};

    return {
        uploadImage(file: string): TaskEither<ImgurError, string> {
            return pipe(
                postRequest<any>("https://api.imgur.com/3/image", {image: file.replace("data:image/png;base64,", "")}, authorization),
                chain(result => {
                    if (!result['success']) {
                        return left({type: "imgurError", error: JSON.stringify(result)})
        ***REMOVED***
                    return right(result['data']['link']);
    ***REMOVED***)
            )
        }
    };
};

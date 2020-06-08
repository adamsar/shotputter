import {TaskEither} from "fp-ts/lib/TaskEither";
import {HttpError} from "../HostedRequester";

export type ImageUploadError = HttpError | {type: "imageUpload", error: any}

export interface ImageUploader {

    uploadImage(image: string): TaskEither<ImageUploadError, string>;

}

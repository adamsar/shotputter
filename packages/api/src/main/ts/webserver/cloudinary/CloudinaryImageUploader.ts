import cloudinary from "cloudinary";
import {ImageUploader, ImageUploadError} from "@shotputter/common/src/main/ts/services/images/uploader";
import {TaskEither, mapLeft, map} from "fp-ts/TaskEither";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import { pipe } from "fp-ts/lib/pipeable";

export const CloudinaryUploader = (cloud_name: string, api_key: string, api_secret: string): ImageUploader => {
    cloudinary.v2.config({
        cloud_name,
        api_key,
        api_secret
    });
    return {
        uploadImage(image: string): TaskEither<ImageUploadError, string> {
            return pipe(
                taskEitherExtensions.fromPromise(
                cloudinary.v2.uploader.upload(image)
            ),
                mapLeft(error => ({type: "imageUpload", error}) as ImageUploadError),
                map(result => result.url)
            );
        }

    }
}

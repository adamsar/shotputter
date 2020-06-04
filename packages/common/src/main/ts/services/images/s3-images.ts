import {chain, mapLeft, TaskEither} from "fp-ts/lib/TaskEither";
import {CognitoIdentityCredentials} from "aws-sdk/lib/credentials/cognito_identity_credentials";
import S3, {PutObjectRequest} from "aws-sdk/clients/s3";
import {base64ToBlob} from "base64-blob";
import {taskEitherExtensions} from "../../util/fp-util";
import {pipe} from "fp-ts/lib/pipeable";
import {left, right} from "fp-ts/lib/Either";
import {ImageUploader, ImageUploadError} from "./uploader";
import {Credentials} from "aws-sdk";

export const getIncognitoCredentials = (identityPoolId: string) => {
    return new CognitoIdentityCredentials({IdentityPoolId: identityPoolId});
}

export const S3Images = (region: string, bucket: string, credentials?: Credentials, prefix: string = "images"): ImageUploader => {
    const s3 = new S3({
        ...(credentials ? {credentials} : {}),
        region,
        apiVersion: "2006-03-01"
    });
    return {
        uploadImage: (image: string): TaskEither<ImageUploadError, string> => {
            return pipe(
                taskEitherExtensions.fromPromise(base64ToBlob(image)),
                mapLeft<string, ImageUploadError>((error: any) => ({type: "imageUpload", error: {section: "base642Blob", error}})),
                chain((Body: Blob) => {
                    const Key = `${prefix}/${new Date().toISOString()}.jpg`
                    const request: PutObjectRequest = {
                        Body,
                        Bucket: bucket,
                        Key
                    }
                    return () => new Promise((resolve, _) => {
                        s3.putObject(request, (err, _) => {
                          if (!err) {
                              resolve(right(`https://${bucket}.${region}.amazonaws.com/${Key}`))
                          } else {
                              return resolve(left({type: "imageUpload", error: {section: "upload", err}}))
                          }
                        })
                    })
                })
            )
        }
    }
}

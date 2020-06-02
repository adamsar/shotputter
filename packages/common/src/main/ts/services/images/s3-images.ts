import {chain, mapLeft, TaskEither} from "fp-ts/lib/TaskEither";
import {CognitoIdentityCredentials} from "aws-sdk/lib/credentials/cognito_identity_credentials";
import S3, {PutObjectRequest} from "aws-sdk/clients/s3";
import {base64ToBlob} from "base64-blob";
import {taskEitherExtensions} from "../../util/fp-util";
import {pipe} from "fp-ts/lib/pipeable";
import {right, left} from "fp-ts/lib/Either";

type S3Error = {type: "s3Error", error: any};

export interface S3Images {
    uploadImage(image: string): TaskEither<S3Error, string>
}

export const S3Images = (region: string, identityPoolId: string, bucket: string, prefix: string = "images"): S3Images => {
    const credentials = new CognitoIdentityCredentials({IdentityPoolId: identityPoolId});
    const s3 = new S3({
        credentials,
        region,
        apiVersion: "2006-03-01"
    });
    return {
        uploadImage: (image: string): TaskEither<S3Error, string> => {
            return pipe(
                taskEitherExtensions.fromPromise(base64ToBlob(image)),
                mapLeft<string, S3Error>(error => ({type: "s3Error", error: {section: "base642Blob", error}})),
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
                              return resolve(left({type: "s3Error", error: {section: "upload", err}}))
                          }
                        })
                    })
                })
            )
        }
    }
}

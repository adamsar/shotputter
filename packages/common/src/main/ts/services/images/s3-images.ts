import {chain, mapLeft, taskEither, TaskEither} from "fp-ts/lib/TaskEither";
import {CognitoIdentityCredentials} from "aws-sdk/lib/credentials/cognito_identity_credentials";
import S3, {PutObjectRequest} from "aws-sdk/clients/s3";
import {pipe} from "fp-ts/lib/pipeable";
import {Either, left, right} from "fp-ts/lib/Either";
import {ImageUploader, ImageUploadError} from "./uploader";
import {Credentials} from "aws-sdk";
import {Base64Extensions} from "../../../../../../browser/src/main/ts/util/files";

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
                taskEither.of(Base64Extensions.toBuffer(image)),
                mapLeft<string, ImageUploadError>((error: any) => ({type: "imageUpload", error: {section: "base642Buffer", error}})),
                chain((Body) => {
                    const Key = `${prefix}/${new Date().toISOString()}.png`
                    const request: PutObjectRequest = {
                        Body,
                        Bucket: bucket,
                        Key,
                        ContentType: "image/png"
        ***REMOVED***
                    return () => new Promise<Either<ImageUploadError, string>>((resolve, _) => {
                        s3.putObject(request, (err) => {
                          if (!err) {
                              resolve(right(`https://${bucket}.s3-${region}.amazonaws.com/${Key}`))
              ***REMOVED*** else {
                              return resolve(left({type: "imageUpload", error: {section: "upload", err}}))
              ***REMOVED***
            ***REMOVED***)
        ***REMOVED***).catch(error => left<ImageUploadError, string>({type: "imageUpload", error}))
    ***REMOVED***)
            )
        }
    }
}

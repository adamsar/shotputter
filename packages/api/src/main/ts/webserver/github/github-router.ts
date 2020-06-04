import {GithubServerConfig} from "../server";
import * as express from "express";
import {imageValidator, messageValidator} from "../validators/post-validators";
import {labelsValidator, ownerValidator, repoValidator, titleValidator} from "../validators/github-validators";
import {route} from "../routing/route";
import {EitherAsync, Left, Right} from "purify-ts";
import {expressValidateToErrorResponse} from "../routing/response-errors";
import {GithubPoster} from "@shotputter/common/src/main/ts/services/poster/github/GithubPoster";
import {Posted} from "../routing/StandardResponses";
import {BadResponse, Ok} from "../routing/responses";
import {isLeft} from "fp-ts/lib/Either";
import {ImageUploader} from "@shotputter/common/src/main/ts/services/images/uploader";

export interface GithubPostRequest {
    image: string;
    token: string;
    title: string;
    message?: string;
    repo?: string;
    owner?: string;
    labels?: string[];
}

export const githubRouter = (githubConfig: GithubServerConfig, imageUploader: ImageUploader): express.Router => {
    const router = express.Router();
    const githubService = GithubPoster(githubConfig.token, imageUploader);

    router.post("/post", [
        imageValidator,
        messageValidator,
        titleValidator,
        labelsValidator,
        ownerValidator(true),
        repoValidator(true)
    ], route(({req}) => {
        return expressValidateToErrorResponse<GithubPostRequest>(req)
            .chain(postRequest => EitherAsync(async ({liftEither}) => {
                const githubConfig = {
                    repo: postRequest.repo,
                    owner: postRequest.owner,
                    title: postRequest.title,
                    labels: postRequest.labels || [],
    ***REMOVED***;
                const image = await imageUploader.uploadImage(postRequest.image)();
                if (isLeft(image)) {
                    return liftEither(Left(BadResponse({error: "server", message: JSON.stringify(image.left)})))
    ***REMOVED***
                const succeeded = await githubService.postIssue({
                    post: {
                        image: image.right,
                        message: postRequest.message
    ***REMOVED***
                    ...githubConfig
    ***REMOVED***)();
                if (isLeft(succeeded)) {
                    return liftEither(Left(BadResponse({error: "server", message: JSON.stringify(succeeded.left)})))
    ***REMOVED*** else {
                    return liftEither(Right(Posted));
    ***REMOVED***

***REMOVED***));
    }));

    router.get("/repos", route(() => EitherAsync(async ({ liftEither }) => {
        const repos = await githubService.listRepos()();
        if (isLeft(repos)) {
            return liftEither(Left(BadResponse({error: "server", message: JSON.stringify(repos.left)})))
        } else {
            return liftEither(Right(Ok({repos: repos.right})))
        }
    })));

    return router;
};

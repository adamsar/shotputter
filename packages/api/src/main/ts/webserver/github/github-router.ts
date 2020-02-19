import {GithubServerConfig, ImgurServerConfig} from "../server";
import * as express from "express";
import {imageValidator, messageValidator} from "../validators/post-validators";
import {labelsValidator, ownerValidator, repoValidator, titleValidator} from "../validators/github-validators";
import {route} from "../routing/route";
import {EitherAsync, Right} from "purify-ts";
import {expressValidateToErrorResponse} from "../routing/response-errors";
import {
    GithubPoster,
    GithubPosterConfig
} from "@shotputter/common/src/main/ts/services/poster/github/GithubPoster";
import {ImgurUploader} from "@shotputter/common/src/main/ts/services/images/imgur";
import {Posted} from "../routing/StandardResponses";
import {Ok} from "../routing/responses";

export interface GithubPostRequest {
    image: string;
    token: string;
    title: string;
    message?: string;
    repo?: string;
    owner?: string;
    labels?: string[];
}

export const githubRouter = (githubConfig: GithubServerConfig, imgurConfig: ImgurServerConfig): express.Router => {
    const router = express.Router();
    const imgurService = ImgurUploader(imgurConfig.clientId);

    router.post("/post", [
        imageValidator,
        messageValidator,
        imageValidator,
        titleValidator,
        labelsValidator,
        ownerValidator,
        repoValidator
    ], route(({req}) => {
        return expressValidateToErrorResponse<GithubPostRequest>(req)
            .chain(postRequest => EitherAsync(async ({liftEither}) => {
                const config: GithubPosterConfig = {
                    token: githubConfig.token,
                    repo: postRequest.repo || githubConfig.defaultRepo,
                    owner: postRequest.owner || githubConfig.defaultOwner,
                    title: postRequest.title,
                    labels: postRequest.labels || [],
                    canPost: true
                };
                const githubPoster = GithubPoster(config, imgurService);
                const image = await imgurService.uploadImage(postRequest.image);
                await githubPoster.send({
                    image,
                    message: postRequest.message
                });
                return liftEither(Right(Posted));
            }));
    }));

    router.get("/repos", route(() => EitherAsync(async ({ liftEither }) => {
        const githubPoster = GithubPoster({
            canPost: false,
            token: githubConfig.token
        }, imgurService);
        const repos = await githubPoster.listRepos();
        return liftEither(Right(Ok({ repos })));
    })));

    return router;
};
import {Post} from "../Post";
import {getRequest, HostedRequester, HttpError, postRequest} from "../../HostedRequester";
import {chain, fromEither, left, map, right, TaskEither} from "fp-ts/lib/TaskEither";
import {pipe} from "fp-ts/lib/pipeable";
import {eitherExtensions} from "../../../util/fp-util";
import {mapLeft} from "fp-ts/lib/TaskThese";
import {ImageUploader} from "../../images/uploader";

export type GithubError = {type: "githubError"; error: string;} | HttpError;

export type GithubPosterConfig = {
    token: string;
    user?: string;
};

export interface RepoInfo {
    owner: string;
    repo: string;
}

export type GithubPoster = {

    listRepos: () => TaskEither<GithubError, RepoInfo[]>;

    postIssue: ({post, repo, owner, title, labels}: { post: Post, repo: string, owner: string, title: string, labels: string[] }) => TaskEither<GithubError, true>;

}

const GithubBase: string = "https://api.github.com";

export const HostedGithubPoster = (hostedRequester: HostedRequester): GithubPoster => {

    return {
        listRepos() {
            return pipe(
                hostedRequester.get<any>("/github/repos"),
                chain(response => fromEither("repos" in response ? eitherExtensions.right(response["repos"]) : eitherExtensions.left({type: "githubError", error: JSON.stringify(response)})))
            );
        },
        postIssue({post, repo, owner, title, labels}: { post: Post, repo: string, owner: string, title: string, labels: string[] }): TaskEither<GithubError, true> {
            return pipe(
                hostedRequester.post("/github/post", {
                    repo,
                    owner,
                    title,
                    labels,
                    ...post
                }),
                map(_ => true)
            )
        }
    }
};

export const GithubPoster = (token: string, imageUploader: ImageUploader): GithubPoster => {
    const authHeader = {
        Authorization: `token ${token}`
    };
    return {
        postIssue({post, repo, owner, title, labels}: { post: Post, repo: string, owner: string, title: string, labels: string[] }): TaskEither<GithubError, true> {
            return pipe(
                imageUploader.uploadImage(post.image),
                mapLeft(x => "imageUpload" === x.type ? {type: "githubError", error: JSON.stringify(x)} : x),
                chain(imgUrl => postRequest<any>(
                        `${GithubBase}/repos/${owner}/${repo}/issues`,
                    {
                            title,
                            labels,
                            body:  `![Screenshot](${imgUrl})
                            ${post.message || ""}`,
                        },
                        authHeader)),
                chain(result => {
                    if (result['state']) {
                        return right(true);
                    } else {
                        return left({type: "githubError", error: JSON.stringify(result)});
                    }
                })
            );
        },

        listRepos(): TaskEither<GithubError, RepoInfo[]> {
            return pipe(
                getRequest<any>(`${GithubBase}/user/repos?per_page=100`, authHeader),
                map(response => response.map((repo: any) => ({owner: repo['owner']['login'], repo: repo['name']})))
            )
        }

    };
};

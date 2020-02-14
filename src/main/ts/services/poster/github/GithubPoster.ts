import {Poster} from "../Poster";
import {Post} from "../Post";
import {PostResult} from "../PostResult";
import {ImgurUploader} from "../../images/imgur";

export type GithubPosterConfig  = {

    token: string;
    repo?: string;
    owner?: string;
    canPost: false
    
} | {

    token: string;
    repo: string;
    owner: string;
    title:string;
    labels: string[];
    canPost: true

}

interface GithubPosterConfigSetter {
    repo: string;
    owner: string;
    title: string;
    labels?: string[];
}

export interface RepoInfo {
    owner: string;
    repo: string;
}

export type GithubPoster = Poster & {

    setConfig: (options: GithubPosterConfigSetter) => void;

    config: GithubPosterConfig;

    listRepos: () => Promise<RepoInfo[]>;

}

const GithubBase: string = "https://api.github.com";

export const GithubPoster = (_config: GithubPosterConfig, imgurUploader: ImgurUploader): GithubPoster => {
    let config = { ..._config };

    return {
        typeName: "github",

        config,

        send: async (post: Post): Promise<PostResult> => {
            if (config.canPost) {
                try {
                    const imgUrl = await imgurUploader.uploadImage(post.image);
                    const result: any = await (await fetch(`${GithubBase}/repos/${config.owner}/${config.repo}/issues`, {
                        method: "POST",
                        body: JSON.stringify({
                            title: config.title,
                            body: `![Screenshot](${imgUrl})
                            ${post.message || ""}`,
                            labels: config.labels
            ***REMOVED***),
                        headers: {
                            Authorization: `token ${config.token}`
            ***REMOVED***
        ***REMOVED***)).json();
                    if (result['state']) {
                        return true;
        ***REMOVED***
    ***REMOVED*** catch (error) {
                    return { error };
    ***REMOVED***
***REMOVED***
            return { error: "Insufficient data" }
        },

        listRepos: async () => {
            const repos: any[] = await (await fetch(`${GithubBase}/user/repos?per_page=100`, {
                method: "GET",
                headers: {
                    Authorization: `token ${config.token}`
    ***REMOVED***
***REMOVED***)).json();


            return repos.map(repo => ({
                owner: repo['owner']['login'],
                repo: repo['name']
***REMOVED***));
        },

        setConfig: (options: GithubPosterConfigSetter) => {
            config = { ...config, ...options, canPost: true, labels: options.labels || [] };
        }
    };
};
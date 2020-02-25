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

} | {
    url: string;
    owner?: string;
    repo?: string;
    labels: string[];
    title: string;

};

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

export const HostedGithubPoster = (url: string, _config: GithubPosterConfig): GithubPoster => {
    let config: GithubPosterConfig = {
        url,
        owner: _config.owner,
        repo: _config.repo,
        labels: [],
        title: ""
    };

    return {
        typeName: "github",
        config,
        listRepos: async () => {
            return (await (await fetch(`${url}/github/repos`, {method: 'get'})).json())['repos'];
        },
        setConfig: (p1: GithubPosterConfigSetter) => {
            config = {...config, ...p1};
        },
        send: async (post: Post): Promise<PostResult> => {
            try {
                await fetch(`${url}/github/post`, {
                    method: "post",
                    body: JSON.stringify({
                        repo: config.repo,
                        owner: config.owner,
                        // @ts-ignore
                        title: config.title,
                        // @ts-ignore
                        labels: config.labels,
                        image: post.image,
                        message: post.message
        ***REMOVED***),
                    headers: {
                        "Content-Type": "application/json"
        ***REMOVED***});
***REMOVED*** catch (error) {
                return { error };
***REMOVED***
        }
    }
};

export const GithubPoster = (_config: GithubPosterConfig, imgurUploader: ImgurUploader): GithubPoster => {
    let config = { ..._config };

    return {
        typeName: "github",

        config,

        send: async (post: Post): Promise<PostResult> => {
            if ("title" in config && "canPost" in config && config.canPost) {
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
            if ("token" in config) {
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
***REMOVED***
            return []
        },

        setConfig: (options: GithubPosterConfigSetter) => {
            // @ts-ignore
            config = { ...config, ...options, canPost: true, labels: options.labels || [] };
        }
    };
};
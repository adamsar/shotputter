import {observable} from "mobx";
import html2canvas from "html2canvas";
import {MAIN_ID} from "../constants";
import {Post} from "../services/poster/Post";
import {Poster} from "../services/poster/Poster";
import {DownloadPoster} from "../services/poster/DownloadPoster";
import {AppOptions} from "../App";
import {SlackPoster} from "../services/poster/slack/SlackPoster";
import {GithubPoster} from "../services/poster/github/GithubPoster";
import {ImgurUploader} from "../services/images/imgur";

export class ScreenshotStore {

    @observable screenshotCanvas: HTMLCanvasElement | null = null;
    @observable screenshot: string;
    @observable post: Post | null = null;
    @observable availablePosters: Poster[] = [];
    githubPoster: GithubPoster | null = null;
    slackPoster: SlackPoster | null = null;

    constructor(appOptions: AppOptions) {
        const availablePosters = [];
        if (appOptions.download !== false) {
            availablePosters.push(DownloadPoster(document));
        }
        if (appOptions.slack?.token) {
            this.slackPoster = SlackPoster({...appOptions.slack, channel: appOptions.slack.channel || ""})
            availablePosters.push(this.slackPoster);
        }
        if (appOptions.github?.token) {
            if (appOptions.imgur?.clientId) {
                this.githubPoster = GithubPoster({...appOptions.github, canPost: false}, ImgurUploader(appOptions.imgur?.clientId));
                availablePosters.push(this.githubPoster);
***REMOVED*** else {
                console.warn("Image uploader not set! Can not use github");
***REMOVED***
        }
        this.availablePosters = availablePosters;
    }

    async takeScreenshot() {
        const canvas = await html2canvas(document.body, {
            height: window.innerHeight,
            width: window.innerWidth,
            y: window.scrollY,
            ignoreElements: element => element.id === MAIN_ID,
***REMOVED***
        this.screenshotCanvas = document.createElement("canvas");
        this.screenshot = canvas.toDataURL("image/jpeg");
    }

    setPost(post: Post) {
        this.post = post;
    }

    resetCanvas() {
        this.screenshotCanvas = null;
        this.screenshot = null;
        this.post = null;
    }

}
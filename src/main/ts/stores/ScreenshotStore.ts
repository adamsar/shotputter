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
        const availablePosters = [DownloadPoster(document)];
        if (appOptions.slack?.token) {
            this.slackPoster = SlackPoster({...appOptions.slack, channel: appOptions.slack.channel || ""})
            availablePosters.push(this.slackPoster);
        }
        if (appOptions.github?.token) {
            if (appOptions.imgur?.clientId) {
                this.githubPoster = GithubPoster({...appOptions.github, canPost: false}, ImgurUploader(appOptions.imgur?.clientId));
                availablePosters.push(this.githubPoster);
            } else {
                console.warn("Image uploader not set! Can not use github");
            }
        }
        this.availablePosters = availablePosters;
    }

    async takeScreenshot() {
        const canvas = await html2canvas(document.body, {
           ignoreElements: element => element.id === MAIN_ID
        });
        this.screenshotCanvas = canvas;
        this.screenshot = this.screenshotCanvas.toDataURL("image/jpeg");
    }

    setPost(post: Post) {
        this.post = post;
    }

    resetCanvas() {
        this.screenshotCanvas = null;
        this.post = null;
    }

}
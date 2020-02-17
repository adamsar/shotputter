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

// @ts-ignore
function screenshot(element, options = {}) {
    // our cropping context
    let cropper = document.createElement('canvas').getContext('2d');
    // save the passed width and height
    // @ts-ignore
    let finalWidth = options.width || window.innerWidth;
    // @ts-ignore
    let finalHeight = options.height || window.innerHeight;
    // update the options value so we can pass it to h2c
    // @ts-ignore
    if (options.x) {
        // @ts-ignore
        options.width = finalWidth + options.x;
    }
    // @ts-ignore
    if (options.y) {
        // @ts-ignore
        options.height = finalHeight + options.y;
    }
    // chain h2c Promise
    return html2canvas(element, options).then(c => {
        // do our cropping
        cropper.canvas.width = finalWidth;
        cropper.canvas.height = finalHeight;
        // @ts-ignore
        cropper.drawImage(c, -(+options.x || 0), -(+options.y || 0));
        // return our canvas
        return cropper.canvas;
    });
}

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
                        height: window.innerHeight,
                        width: window.innerWidth,
                        y: window.scrollY,
                        ignoreElements: element => element.id === MAIN_ID,
                    });
        this.screenshotCanvas = document.createElement("canvas");
        this.screenshot = canvas.toDataURL("image/jpeg");
    }

    setPost(post: Post) {
        this.post = post;
    }

    resetCanvas() {
        this.screenshotCanvas = null;
        this.post = null;
    }

}
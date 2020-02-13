import {observable} from "mobx";
import html2canvas from "html2canvas";
import {MAIN_ID} from "../constants";
import {Post} from "../services/poster/Post";
import {Poster} from "../services/poster/Poster";
import {DownloadPoster} from "../services/poster/DownloadPoster";
import {AppOptions} from "../App";
import {SlackPoster} from "../services/poster/slack/SlackPoster";

export class ScreenshotStore {

    @observable screenshotCanvas: HTMLCanvasElement | null = null;
    @observable post: Post | null = null;
    @observable availablePosters: Poster[] = [];

    constructor(appOptions: AppOptions) {
        const availablePosters = [DownloadPoster(document)];
        if (appOptions.slack?.token) {
            availablePosters.push(SlackPoster({...appOptions.slack, channel: appOptions.slack.channel || ""}));
        }
        this.availablePosters = availablePosters;
    }

    async takeScreenshot() {
        const canvas = await html2canvas(document.body, {
           ignoreElements: element => element.id === MAIN_ID
***REMOVED***
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        this.screenshotCanvas = canvas;
    }

    setPost(post: Post) {
        this.post = post;
    }

    resetCanvas() {
        this.screenshotCanvas = null;
        this.post = null;
    }

}
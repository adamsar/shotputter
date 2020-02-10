import {observable} from "mobx";
import html2canvas from "html2canvas";
import {MAIN_ID} from "../constants";
import {Post} from "../services/poster/Post";

export class ScreenshotStore {

    @observable screenshotCanvas: HTMLCanvasElement | null = null;
    @observable post: Post | null = null;

    async takeScreenshot() {
        const canvas = await html2canvas(document.body, {
           ignoreElements: element => element.id === MAIN_ID
        });
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
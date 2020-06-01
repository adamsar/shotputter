import {observable} from "mobx";
import html2canvas from "html2canvas";
import {MAIN_ID} from "../constants";
import {Post} from "@shotputter/common/src/main/ts/services/poster/Post";
import {Metadata} from "@shotputter/common/src/main/ts/models/Metadata";

export class ScreenshotStore {

    @observable screenshotCanvas: HTMLCanvasElement | null = null;
    @observable screenshot: string;
    @observable post: Post | null = null;
    @observable metadata: object | null = null;

    constructor() {
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
        this.post = {...post, metadata: this.metadata};
    }

    setMetadata(metadata: Metadata) {
        this.metadata = metadata;
        if (this.post) {
            this.post.metadata = metadata
        }
    }

    resetCanvas() {
        this.screenshotCanvas = null;
        this.screenshot = null;
        this.post = null;
    }

}

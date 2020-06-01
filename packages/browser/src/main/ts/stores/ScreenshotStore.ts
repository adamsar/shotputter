import {observable} from "mobx";
import html2canvas from "html2canvas";
import {MAIN_ID} from "../constants";
import {Post} from "@shotputter/common/src/main/ts/services/poster/Post";
import {Metadata} from "@shotputter/common/src/main/ts/models/Metadata";
import RingBuffer from "ringbufferjs";

export class ScreenshotStore {

    @observable screenshotCanvas: HTMLCanvasElement | null = null;
    @observable screenshot: string;
    @observable post: Post | null = null;
    @observable metadata: object | null = null;
    @observable logBuffer: RingBuffer<string>;

    constructor(captureLogs?: boolean) {
        if (captureLogs) {
            console.log("capturing");
            this.logBuffer = new RingBuffer<string>(20);
            const wrapLog = (level: string, fn: (msg: any, ...args: any[]) => void) => {
                return (msg: any, ...args2: any[]) => {
                    fn(msg, ...args2);
                    this.logBuffer.enq(level + ": " + msg);
                }
            }
            console.log = wrapLog("log", console.log);
            console.warn = wrapLog("warn", console.warn);
            console.error = wrapLog("error", console.error);
            console.debug = wrapLog("debug", console.debug);
        }
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
        this.post = {...post, metadata: this.metadata, ...(this.logBuffer?.size() ?? 0 > 0 ? {logs: this.logBuffer.peekN(this.logBuffer.size())} : {})};
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

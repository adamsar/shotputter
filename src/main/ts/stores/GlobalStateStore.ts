import {computed, observable} from "mobx";
import {AppOptions} from "../App";
import {SlackService, SlackServiceClient} from "../services/poster/slack/SlackPoster";

interface WindowSize {
    width: number;
    height: number;
}

const computeWindowSize = (): WindowSize => {
    const w=window;
    const d=document;
    const e=d.documentElement;
    const g=d.getElementsByTagName('body')[0];
    const width=w.innerWidth||e.clientWidth||g.clientWidth;
    const height =w.innerHeight||e.clientHeight||g.clientHeight;

    return { width, height }
}

export type DisplayMode = "unclicked" | "processing_screenshot" | "display_screenshot" | "display_poster";

export class GlobalStateStore {

    constructor(appOptions: AppOptions) {
        window.addEventListener("resize", () => {
            this.windowSize = computeWindowSize();
        });
        this.appOptions = appOptions;
        if (appOptions.slack?.token) {
            this.slackService = SlackService(appOptions.slack?.token);
        }
    }

    @observable.struct windowSize: WindowSize = computeWindowSize();

    @observable displayMode: DisplayMode = "unclicked";

    @observable canvas: HTMLCanvasElement | null = null;

    @observable appOptions: AppOptions | null = null;

    slackService: SlackServiceClient | null = null;

    @computed get isMobile(): boolean { return this.windowSize.width < 768 }

}
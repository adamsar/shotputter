import {computed, observable} from "mobx";
import {AppOptions} from "../App";
import {
    HostedSlackService,
    SlackService,
    SlackServiceClient
} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {ImgurUploader} from "@shotputter/common/src/main/ts/services/images/imgur";

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
        if (appOptions.service?.url && (appOptions.service?.enabledProviders || []).find((x) => x === "slack")) {
            this.slackService = HostedSlackService(appOptions.service.url);
        }
        if (appOptions.imgur?.clientId) {
            this.imgurService = ImgurUploader(appOptions.imgur?.clientId);
        }
    }

    @observable.struct windowSize: WindowSize = computeWindowSize();

    @observable displayMode: DisplayMode = "unclicked";

    @observable canvas: HTMLCanvasElement | null = null;

    @observable appOptions: AppOptions | null = null;

    slackService: SlackServiceClient | null = null;

    imgurService: ImgurUploader | null = null;

    @computed get isMobile(): boolean { return this.windowSize.width < 768 }

}
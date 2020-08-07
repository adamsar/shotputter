import {computed, observable} from "mobx";
import {HostedSlackService, SlackServiceClient} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {HostedRequester} from "@shotputter/common/src/main/ts/services/HostedRequester";
import {GithubPoster, HostedGithubPoster} from "@shotputter/common/src/main/ts/services/poster/github/GithubPoster";
import {DownloadPoster} from "@shotputter/common/src/main/ts/services/poster/DownloadPoster";
import {HttpPoster} from "@shotputter/common/src/main/ts/services/poster/http/HttpPoster";
import {ImageUploader} from "@shotputter/common/src/main/ts/services/images/uploader";
import {ShotputBrowserConfig} from "../config/ShotputBrowserConfig";

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

    constructor(appOptions: ShotputBrowserConfig) {
        window.addEventListener("resize", () => {
            this.windowSize = computeWindowSize();
***REMOVED***
        this.appOptions = appOptions;
        const requester: HostedRequester | null = typeof appOptions.service === "object" ? new HostedRequester(appOptions.service.url) : null;
        if (appOptions.download?.enabled !== false) {
            this.downloadService = DownloadPoster(document);
            this.availablePosters.push("download");
        }
        if (requester && appOptions.slack?.enabled) {
            this.slackService = HostedSlackService(requester);
        }
        if (requester && appOptions.github?.enabled) {
            this.githubService = HostedGithubPoster(requester);
        }
        if (appOptions.custom?.enabled) {
            this.customRequestService = HttpPoster(appOptions.custom.endpoint);
        }
        if (typeof appOptions.service === "object" && appOptions.service.autoPost) {
            this.availablePosters.push("auto");
            if (appOptions.slack?.enabled && appOptions.slack?.autoPost) {
                this.autoPosters.push("slack");
***REMOVED***
            if (appOptions.github?.enabled && appOptions.github?.autoPost) {
                this.autoPosters.push("github");
***REMOVED***
            if (appOptions.custom?.enabled && appOptions.custom?.autoPost) {
                this.autoPosters.push("custom");
***REMOVED***
        }
    }

    @observable.struct windowSize: WindowSize = computeWindowSize();

    @observable displayMode: DisplayMode = "unclicked";

    @observable canvas: HTMLCanvasElement | null = null;

    @observable appOptions: ShotputBrowserConfig | null = null;

    @observable availablePosters: ("slack" | "download" | "github" | "custom" | "auto")[] = [];

    @observable autoPosters: ("slack" | "custom" | "github")[] = [];

    slackService: SlackServiceClient | null = null;

    imgurService: ImageUploader | null = null;

    githubService: GithubPoster | null = null;

    downloadService: DownloadPoster | null = null;

    customRequestService: HttpPoster | null = null;

    s3Service: ImageUploader | null = null;

    @computed get isMobile(): boolean { return this.windowSize.width < 768 }

}

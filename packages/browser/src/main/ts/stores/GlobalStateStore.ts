import {computed, observable} from "mobx";
import {AppOptions} from "../App";
import {
    HostedSlackService,
    SlackService,
    SlackServiceClient
} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {ImgurUploader} from "@shotputter/common/src/main/ts/services/images/imgur";
import {HostedRequester} from "@shotputter/common/src/main/ts/services/HostedRequester";
import {GithubPoster, HostedGithubPoster} from "@shotputter/common/src/main/ts/services/poster/github/GithubPoster";
import {DownloadPoster} from "@shotputter/common/src/main/ts/services/poster/DownloadPoster";
import {HttpPoster} from "@shotputter/common/src/main/ts/services/poster/http/HttpPoster";

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
        const requester: HostedRequester | null = appOptions?.service?.url ? new HostedRequester(appOptions?.service?.url) : null;
        if (appOptions.download !== false) {
            this.downloadService = DownloadPoster(document);
            this.availablePosters.push("download");
        }
        if (appOptions.slack?.token) {
            this.slackService = SlackService(appOptions.slack?.token);
            this.availablePosters.push("slack")
        }
        if (requester && (appOptions?.service?.enabledProviders ?? []).find(x => x === "slack")) {
            this.slackService = HostedSlackService(requester);
            this.availablePosters.push("slack");
        }
        if (appOptions.imgur?.clientId) {
            this.imgurService = ImgurUploader(appOptions.imgur?.clientId);
        }
        if (appOptions.github?.token && this.imgurService) {
            this.githubService = GithubPoster(appOptions.github?.token, this.imgurService);
            this.availablePosters.push("github");
        }
        if (requester && (appOptions?.service?.enabledProviders ?? []).find(x => x === "github")) {
            this.githubService = HostedGithubPoster(requester);
            this.availablePosters.push("github");
        }
        if (appOptions.customEndpoint) {
            this.customRequestService = HttpPoster(appOptions.customEndpoint);
            this.availablePosters.push("custom");
        }
    }

    @observable.struct windowSize: WindowSize = computeWindowSize();

    @observable displayMode: DisplayMode = "unclicked";

    @observable canvas: HTMLCanvasElement | null = null;

    @observable appOptions: AppOptions | null = null;

    @observable availablePosters: ("slack" | "download" | "github" | "custom")[] = [];

    slackService: SlackServiceClient | null = null;

    imgurService: ImgurUploader | null = null;

    githubService: GithubPoster | null = null;

    downloadService: DownloadPoster | null = null;

    customRequestService: HttpPoster | null = null;

    @computed get isMobile(): boolean { return this.windowSize.width < 768 }

}

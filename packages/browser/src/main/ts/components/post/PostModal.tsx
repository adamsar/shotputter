import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Modal} from "../common/Modal";
import {SlackModal} from "./SlackModal";
import {GithubModal} from "./GithubModal";
import {DownloadModal} from "./DownloadModal";
import {CustomModal} from "./CustomModal";
import {AutoPostHandler} from "./AutoPostHandler";
import {GoogleModal} from "./GoogleModal";
import {JiraPostModal} from "./JiraPostModal";

export const PostModal = observer(() => {
    const { screenshot, global } = useStores();
    const initial = (typeof global.appOptions?.service === "object" && global.appOptions.service.autoPostFirst) ? "auto" : "base";
    const [route, setRoute] = React.useState<"base" | "slack" | "github" | "download" | "custom" | "auto" | "google" | "jira">(initial);

    const onClose = () => {
        screenshot.setPost(null);
        global.displayMode = "unclicked";
    };

    const posterButtons = global.availablePosters.map(poster => {
        switch (poster) {
            case "google":
                return <li key={"google"} onClick={() => setRoute("google")}>Google</li>;
            case "github":
                return <li key={"github"} onClick={() => setRoute("github")}>Github</li>;
            case "download":
                return <li key={"download"} onClick={() => setRoute("download")}>Download</li>;
            case "slack":
                return <li key={"slack"} onClick={() => setRoute("slack")}>Slack</li>;
            case "jira":
                return <li key={"jira"} onClick={() => setRoute("jira")}>JIRA</li>;
            case "auto":
                if (typeof global.appOptions.service === "object" && global.appOptions.service.autoPostFirst) {
                    return null
    ***REMOVED*** else {
                    return <li key={"auto"} onClick={() => setRoute("auto")}>Post</li>
    ***REMOVED***
            case "custom":
                return <li key={"custom"} onClick={() => setRoute("custom")}>Custom</li>
        }
    });

    switch (route) {

        case "jira":
            return <JiraPostModal onClose={() => setRoute("base")} />;

        case "github":
            const goBack = () => setRoute("base")
            return <GithubModal onClose={goBack} onFinish={goBack}/>;

        case "base":
            return (
                <Modal onClose={onClose}>
                    <h3 className={"shotput-title"}>
                        Post screenshot
                    </h3>
            ***REMOVED***
                        <ul className={"shotput-poster-list"}>
                            {...posterButtons}
    ***REMOVED***
            ***REMOVED***
                    <div className={"shotput-bottom-buttons"}>
                        <span className={"shotput-editor-button cancel-button"} onClick={onClose}>Close</span>
            ***REMOVED***
                </Modal>
            );

        case "slack":
            return <SlackModal onClose={() => setRoute("base")} onFinish={() => setRoute("base")}/>;

        case "download":
            return <DownloadModal onClose={() => setRoute("base")} onFinish={() => setRoute("base")}/>;

        case "custom":
            return <CustomModal onClose={() => setRoute("base") } />

        case "auto":
            let onBack: () => void;
            if (global.appOptions.download?.enabled === false) {
                onBack = onClose
***REMOVED*** else {
                onBack = () => setRoute("base")
***REMOVED***
            return <AutoPostHandler onBack={onBack} />;

        case "google":
            return <GoogleModal onClose={() => setRoute("base")} />
    }
});

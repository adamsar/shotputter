import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Modal} from "../common/Modal";
import {SlackModal} from "./SlackModal";
import {GithubModal} from "./GithubModal";
import {DownloadModal} from "./DownloadModal";
import {CustomModal} from "./CustomModal";

export const PostModal = observer(() => {
    const { screenshot, global } = useStores();
    const [route, setRoute] = React.useState<"base" | "slack" | "github" | "download" | "custom">("base");

    const onClose = () => {
        screenshot.setPost(null);
        global.displayMode = "unclicked";
    };

    const posterButtons = global.availablePosters.map(poster => {
        switch (poster) {
            case "github":
                return <li key={"github"} onClick={() => setRoute("github")}>Github</li>;
            case "download":
                return <li key={"download"} onClick={() => setRoute("download")}>Download</li>;
            case "slack":
                return <li key={"slack"} onClick={() => setRoute("slack")}>Slack</li>;
            case "custom":
                return <li key={"custom"} onClick={() => setRoute("custom")}>Custom</li>
        }
    });

    switch (route) {

        case "github":
            const goBack = () => setRoute("base")
            return <GithubModal onClose={goBack} onFinish={goBack}/>;

        case "base":
            return (
                <Modal onClose={onClose}>
                    <h3 style={{textAlign: "left"}}>
                        Screenshot actions
                    </h3>
                    <div>
                        <ul className={"shotput-poster-list"}>
                            {...posterButtons}
                        </ul>
                    </div>
                    <div className={"shotput-bottom-buttons"}>
                        <span className={"shotput-bottom-button"} onClick={onClose}>Close</span>
                    </div>
                </Modal>
            );

        case "slack":
            return <SlackModal onClose={() => setRoute("base")} onFinish={() => setRoute("base")}/>;

        case "download":
            return <DownloadModal onClose={() => setRoute("base")} onFinish={() => setRoute("base")}/>;

        case "custom":
            return <CustomModal onClose={() => setRoute("base") } />

    }
});

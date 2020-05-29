import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Modal} from "../common/Modal";
import {SlackModal} from "./SlackModal";
import {GithubModal} from "./GithubModal";
import {isLeft} from "fp-ts/lib/Either";

export const PostModal = observer(() => {
    const { screenshot, global } = useStores();
    const [route, setRoute] = React.useState<"base" | "slack" | "github">("base");

    const onClose = () => {
        screenshot.setPost(null);
        global.displayMode = "unclicked";
    };

    const posterButtons = global.availablePosters.map(poster => {
        switch (poster) {
            case "github":
                return <li key={"github"} onClick={() => setRoute("github")}>Github</li>;
            case "download":
                return <li key={"download"} onClick={async () => {
                    const result = await global.downloadService.send(screenshot.post)();
                    if (isLeft(result)) {
                        console.log(result.left)
                    } else {
                        console.log("SAVED")
                    }
                }}>Download</li>;
            case "slack":
                return <li key={"slack"} onClick={() => setRoute("slack")}>Slack</li>;

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

    }
});

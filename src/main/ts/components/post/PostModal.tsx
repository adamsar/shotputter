import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Modal} from "../common/Modal";
import {SlackModal} from "./SlackModal";

export const PostModal = observer(() => {
    const { screenshot, global } = useStores();
    const [route, setRoute] = React.useState<"base" | "slack">("base");

    const onClose = () => {
        screenshot.setPost(null);
        global.displayMode = "unclicked";
    };

    const posterButtons = screenshot.availablePosters.map(poster => {
        switch (poster.typeName) {
            case "download":
                return <li key={"download"} onClick={() => poster.send(screenshot.post)}>Download -></li>;
            case "slack":
                return <li key={"slack"} onClick={() => setRoute("slack")}>Slack</li>;
        }
    });

    switch (route) {
        case "base":
            return (
                <Modal onClose={onClose}>
                    <h3 style={{textAlign: "left"}}>
                        Screenshot actions
                    </h3>
            ***REMOVED***
                        <ul className={"shotput-poster-list"}>
                            {...posterButtons}
    ***REMOVED***
            ***REMOVED***
                    <div className={"shotput-bottom-buttons"}>
                        <span className={"shotput-bottom-button"} onClick={onClose}>Close</span>
            ***REMOVED***
                </Modal>
            );

        case "slack":
            return <SlackModal onClose={() => setRoute("base")} onFinish={() => ({})}/>;

    }
});
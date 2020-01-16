import {observer} from "mobx-react-lite";
import {useStores} from "../stores";
import {FeedbackTab} from "./tab/FeedbackTab";
import * as React from "react";

export const Routes = observer<{}>(() => {
        const { global } = useStores();
        switch (global.displayMode) {
            case "unclicked":
                return <FeedbackTab text={"Feedback"}/>;
            case "processing_screenshot":
                return <>processing</>;
            case "display_screenshot":
                return <>display</>;
        }
})
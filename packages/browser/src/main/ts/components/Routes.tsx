import {observer} from "mobx-react-lite";
import {useStores} from "../stores";
import {FeedbackTab} from "./tab/FeedbackTab";
import * as React from "react";
import {ProcessScreenshotContainer} from "./processor/ProcessScreenshotContainer";
import {ScreenshotEditor} from "./editor/ScreenshotEditor";
import {PostModal} from "./post/PostModal";

export const Routes = observer<{}>(() => {
        const { global } = useStores();

        switch (global.displayMode) {

            case "unclicked":
                return <FeedbackTab text={"Feedback"}/>;

            case "processing_screenshot":
                return <ProcessScreenshotContainer/>;

            case "display_screenshot":
                return <ScreenshotEditor/>;

            case "display_poster":
                return <PostModal/>;
                
        }
})
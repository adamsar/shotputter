import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";

export type FeedbackTabPosition = "left" | "right" | "top" | "bottom";
interface FeedbackTabProps {
    position?: FeedbackTabPosition;
    text?: string;
}

export const FeedbackTab = observer<FeedbackTabProps>(({position, text}) => {
    const { global } = useStores();

    const handleClick = async () => {
        global.displayMode = "processing_screenshot";
    };

    return (
        <div className={["shotput-feedback-tab-container", `shotput-tab-${position ?? "right"}`].join(" ")}>
            <div className={"shotput-feedback-tab"} onClick={handleClick}>
                {text ?? "Report"}
    ***REMOVED***
***REMOVED***
    );
})
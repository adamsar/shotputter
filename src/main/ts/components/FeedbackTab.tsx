import * as React from "react";
import {observer} from "mobx-react-lite";

export type FeedbackTabPosition = "left" | "right" | "top" | "bottom";
interface FeedbackTabProps {
    position?: FeedbackTabPosition;
    text?: string;
}

export const FeedbackTab = observer<FeedbackTabProps>(({position, text}) => {

    return (
        <div className={["shotput-feedback-tab-container", `shotput-tab-${position ?? "right"}`].join(" ")}>
            <div className={"shotput-feedback-tab"}>
                {text ?? "Report"}
    ***REMOVED***
***REMOVED***
    );
})
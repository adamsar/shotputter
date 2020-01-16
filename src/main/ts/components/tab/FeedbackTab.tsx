import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import * as html2canvas from "html2canvas";

export type FeedbackTabPosition = "left" | "right" | "top" | "bottom";
interface FeedbackTabProps {
    position?: FeedbackTabPosition;
    text?: string;
}

export const FeedbackTab = observer<FeedbackTabProps>(({position, text}) => {
    const { global } = useStores();

    const handleClick = () => {
        console.log(html2canvas);
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
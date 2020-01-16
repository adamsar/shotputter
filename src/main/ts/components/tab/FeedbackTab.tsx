import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import html2canvas from "html2canvas";
import {MAIN_ID} from "../../constants";

export type FeedbackTabPosition = "left" | "right" | "top" | "bottom";
interface FeedbackTabProps {
    position?: FeedbackTabPosition;
    text?: string;
}

export const FeedbackTab = observer<FeedbackTabProps>(({position, text}) => {
    const { global } = useStores();

    const handleClick = async () => {
        const canvas = await html2canvas(document.body, {
            ignoreElements: (element) => {
                return element.id === MAIN_ID
            },
            windowWidth: 600
        });
        global.canvas = canvas;
        global.displayMode = "processing_screenshot";
    };

    return (
        <div className={["shotput-feedback-tab-container", `shotput-tab-${position ?? "right"}`].join(" ")}>
            <div className={"shotput-feedback-tab"} onClick={handleClick}>
                {text ?? "Report"}
            </div>
        </div>
    );
})
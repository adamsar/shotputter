import * as React from "react";

import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {useEffect} from "react";
import InlineSVG from "react-inlinesvg";
import {ModalBackground} from "../common/ModalBackground";
//import {runInAction} from "mobx";
const loader = require("../../../img/loader.svg") as string;

export const ProcessScreenshotContainer = observer(() => {
    const { screenshot, global } = useStores();

    useEffect(() => {
        (async () => {
            if (screenshot.screenshotCanvas === null) {
                await screenshot.takeScreenshot()
            }
        })();
    }, [screenshot.screenshotCanvas]);

    useEffect(() => {
       if (screenshot.screenshotCanvas !== null) {
           global.displayMode = "display_screenshot";
       }
    }, [screenshot.screenshotCanvas]);

    return (
        <>
            <ModalBackground/>
            <div className={"shotput-loading-modal"}>
                <div className={"shotput-loading-container"}>
                    <InlineSVG src={loader} style={{width: "100%"}}/>
                </div>
            </div>
        </>
    );
});
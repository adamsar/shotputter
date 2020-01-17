import * as React from "react";

import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {useEffect} from "react";
import InlineSVG from "react-inlinesvg";
const loader = require("../../../img/loader.svg") as string;

export const ProcessScreenshotContainer = observer(() => {
    const { screenshot } = useStores();
    useEffect(() => {
        (async () => {
            if (screenshot.screenshotCanvas === null) {
                await screenshot.takeScreenshot()
***REMOVED***
        })();
    });

    return (
        <>
            <div className={"shotput-modal-background"}/>
            <div className={"shotput-loading-modal"}>
                <div className={"shotput-loading-container"}>
                    <InlineSVG src={loader} style={{width: "100%"}}/>
        ***REMOVED***
    ***REMOVED***
        </>
    );
});
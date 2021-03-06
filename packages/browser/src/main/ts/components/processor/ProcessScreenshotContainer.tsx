import * as React from "react";
import {useEffect} from "react";

import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Loader} from "./Loader";


export const ProcessScreenshotContainer = observer(() => {
    const { screenshot, global } = useStores();

    useEffect(() => {
        screenshot.takeScreenshot();
    }, []);

    useEffect(() => {
       if (screenshot.screenshotCanvas !== null) {
           global.displayMode = "display_screenshot";
       }
    }, [screenshot.screenshotCanvas]);

    return <Loader/>
});
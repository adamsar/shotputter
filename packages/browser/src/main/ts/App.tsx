import * as React from "react";
import {storeContext} from "./stores";
import {GlobalStateStore} from "./stores/GlobalStateStore";
import {Routes} from "./components/Routes";
import {ScreenshotStore} from "./stores/ScreenshotStore";
import {ToolStore} from "./stores/ToolStore";
import {MAIN_ID} from "./constants";
import * as ReactDOM from "react-dom";
import {WindowErrorComponent} from "./components/logging/WindowErrorComponent";
import {Metadata} from "@shotputter/common/src/main/ts/models/Metadata";
import {ShotputBrowserConfig} from "./config/ShotputBrowserConfig";

export const App = ({options, screenshotStore}: { options: ShotputBrowserConfig, screenshotStore: ScreenshotStore }) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore(options),
        screenshot: screenshotStore,
        tools: new ToolStore()
    }}>
        <Routes/>
        <WindowErrorComponent appOptions={options} />
    </storeContext.Provider>;
};

export const ShotputStart = (options: ShotputBrowserConfig) => {
    const screenshotStore = new ScreenshotStore(options);
    const load = () => {
        const tabHolder = document.createElement("div");
        tabHolder.id = MAIN_ID;
        document.body.appendChild(tabHolder);
        ReactDOM.render(<App options={options} screenshotStore={screenshotStore}/>, tabHolder);
    };

    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        load();
    } else {
        window.addEventListener("DOMContentLoaded", () => {
            load();
***REMOVED***
    }
    return {
        setMetadata: (metadata: Metadata) => {
            screenshotStore.setMetadata(metadata);
        },

        updateMetadata: (metadata: Metadata) => {
            screenshotStore.setMetadata({...(screenshotStore.metadata || {}), ...metadata})

        },
        purgeMetadata: () => {
            screenshotStore.setMetadata({});
        }
    }
};

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

export const App = ({options, screenshotStore}: { options: AppOptions, screenshotStore: ScreenshotStore }) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore(options),
        screenshot: screenshotStore,
        tools: new ToolStore()
    }}>
        <Routes/>
        <WindowErrorComponent appOptions={options} />
    </storeContext.Provider>;
};

export interface AppOptions {
    service?: {
        url?: string;
        enabledProviders?: ("slack" | "github")[];
    };
    slack?: {
        token: string;
        defaultChannel?: string;
    };
    imgur?: {
        clientId: string;
    };
    github?: {
        defaultOwner?: string;
        defaultRepo?: string;
        token: string;
        defaultLabels?: string[];
    };
    errorReporting?: {
        enabled?: boolean;
        slack?: {
            enabled: false;
        } | { enabled: true; channel: string; };
        consoleLog?: {
            enabled: boolean;
        }
    };
    download?: boolean;
    metadata?: Metadata;
    captureLogs?: boolean;
}

export const ShotputStart = (options: AppOptions) => {
    const screenshotStore = new ScreenshotStore(options.captureLogs);
    if (options.metadata) {
        screenshotStore.setMetadata(options.metadata);
    }
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

import * as React from "react";
import {storeContext} from "./stores";
import {GlobalStateStore} from "./stores/GlobalStateStore";
import {Routes} from "./components/Routes";
import {ScreenshotStore} from "./stores/ScreenshotStore";
import {ToolStore} from "./stores/ToolStore";
import {MAIN_ID} from "./constants";
import * as ReactDOM from "react-dom";
import {WindowErrorComponent} from "./components/logging/WindowErrorComponent";

export const App = ({options}: { options: AppOptions }) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore(options),
        screenshot: new ScreenshotStore(),
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
}

export const ShotputStart = (options: AppOptions) => {
    const load = () => {
        const tabHolder = document.createElement("div");
        tabHolder.id = MAIN_ID;
        document.body.appendChild(tabHolder);
        ReactDOM.render(<App options={options}/>, tabHolder);
    };
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        load();
    }
    window.addEventListener("DOMContentLoaded", () => {
        load();
    });
};

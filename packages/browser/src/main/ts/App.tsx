import * as React from "react";
import {storeContext} from "./stores";
import {GlobalStateStore} from "./stores/GlobalStateStore";
import {Routes} from "./components/Routes";
import {ScreenshotStore} from "./stores/ScreenshotStore";
import {ToolStore} from "./stores/ToolStore";
import {MAIN_ID} from "./constants";
import * as ReactDOM from "react-dom";

export const App = ({options}: { options: AppOptions }) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore(options),
        screenshot: new ScreenshotStore(options),
        tools: new ToolStore()
    }}>
        <Routes/>
    </storeContext.Provider>;
};

export interface AppOptions {
    slack?: {
        token: string,
        channel?: string;
    },
    imgur?: {
        clientId: string;
    },
    github?: {
        owner?: string;
        repo?: string;
        token: string;
        labels?: string[];
    }
    download?: boolean
};

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
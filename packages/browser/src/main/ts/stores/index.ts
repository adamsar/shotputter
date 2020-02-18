import * as React from "react";
import {GlobalStateStore} from "./GlobalStateStore";
import {ScreenshotStore} from "./ScreenshotStore";
import {ToolStore} from "./ToolStore";

export interface RootStore {
    global: GlobalStateStore;
    screenshot: ScreenshotStore;
    tools: ToolStore;
}

export const storeContext = React.createContext<RootStore>(null);

export const useStores = () => React.useContext<RootStore>(storeContext);
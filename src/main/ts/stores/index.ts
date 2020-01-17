import * as React from "react";
import {GlobalStateStore} from "./GlobalStateStore";
import {ScreenshotStore} from "./ScreenshotStore";

export interface RootStore {
    global: GlobalStateStore;
    screenshot: ScreenshotStore;
}

export const storeContext = React.createContext<RootStore>(null);

export const useStores = () => React.useContext<RootStore>(storeContext);
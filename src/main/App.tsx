import * as React from "react";
import {storeContext} from "./ts/stores";
import {GlobalStateStore} from "./ts/stores/GlobalStateStore";
import {Routes} from "./ts/components/Routes";
import {ScreenshotStore} from "./ts/stores/ScreenshotStore";

export const App: React.FC<{}> = ({}) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore(),
        screenshot: new ScreenshotStore()
    }}>
        <Routes/>
    </storeContext.Provider>;
}
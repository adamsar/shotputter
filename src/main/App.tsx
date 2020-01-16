import * as React from "react";
import {storeContext} from "./ts/stores";
import {GlobalStateStore} from "./ts/stores/GlobalStateStore";
import {Routes} from "./ts/components/Routes";

export const App: React.FC<{}> = ({}) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore()
    }}>
        <Routes/>
    </storeContext.Provider>;
}
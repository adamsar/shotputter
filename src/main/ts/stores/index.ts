import * as React from "react";
import {GlobalStateStore} from "./GlobalStateStore";

export interface RootStore {
    global: GlobalStateStore;
}

export const storeContext = React.createContext<RootStore>(null);

export const useStores = () => React.useContext<RootStore>(storeContext);
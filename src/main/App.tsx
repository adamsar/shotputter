import * as React from "react";
import {storeContext, useStores} from "./ts/stores";
import {GlobalStateStore} from "./ts/stores/GlobalStateStore";
import {observer} from "mobx-react-lite";

const WindowWatcher = observer(({title}: {title: string}) => {
    const {global} = useStores();
    return (
        <>
            <h1>{title}</h1>
    ***REMOVED***{JSON.stringify(global.windowSize)} ({JSON.stringify(global.isMobile)})***REMOVED***
        </>
    );
});

export const App: React.FC<{}> = ({}) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore()
    }}>
        <WindowWatcher title={"test"}/>
    </storeContext.Provider>;
}
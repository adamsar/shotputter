import * as React from "react";
import {storeContext} from "./ts/stores";
import {GlobalStateStore} from "./ts/stores/GlobalStateStore";
import {FeedbackTab} from "./ts/components/FeedbackTab";

export const App: React.FC<{}> = ({}) => {
    return <storeContext.Provider value={{
        global: new GlobalStateStore()
    }}>
        <FeedbackTab text={"Hello"} position={"right"}/>
    </storeContext.Provider>;
}
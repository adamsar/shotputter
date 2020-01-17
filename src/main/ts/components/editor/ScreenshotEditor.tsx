import * as React from "react";
import {observer} from "mobx-react-lite";
import {EditorToolbar} from "./EditorToolbar";

export const ScreenshotEditor = observer(() => {
    return <>
            <EditorToolbar/>
        </>
});
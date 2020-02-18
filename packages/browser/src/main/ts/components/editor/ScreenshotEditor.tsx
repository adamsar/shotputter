import * as React from "react";
import {observer} from "mobx-react-lite";
import {EditorToolbar} from "./EditorToolbar";
import {EditorCanvas} from "../canvas/EditorCanvas";

export const ScreenshotEditor = observer(() => {
    return <div className={"shotput-editor-container"}>
            <EditorCanvas/>
            <EditorToolbar/>
***REMOVED***
});
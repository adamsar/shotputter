import {observer} from "mobx-react-lite";
import * as React from "react";
import {useStores} from "../../stores";
import {fabric} from "fabric";

interface EditorCanvasProps {

}

export const EditorCanvas = observer<EditorCanvasProps>(() => {
    const { screenshot } = useStores();

    // @ts-ignore
    let canvas: fabric.Canvas = null;

    React.useEffect(() => {
        const canvasElement = document.getElementById("shotput-canvas-container");
        if (canvasElement.children.length === 0) {
            screenshot.screenshotCanvas.id = "shotput-canvas";
            canvasElement.appendChild(screenshot.screenshotCanvas);
            canvas = new fabric.Canvas('shotput-canvas');
            canvas.isDrawingMode = true;
        }
    });

    return <div id={"shotput-canvas-container"} />;
});
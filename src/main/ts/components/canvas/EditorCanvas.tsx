import {observer} from "mobx-react-lite";
import * as React from "react";
import {useStores} from "../../stores";
import {fabric} from "fabric";

interface EditorCanvasProps {

}

export const EditorCanvas = observer<EditorCanvasProps>(() => {
    const { screenshot, tools } = useStores();
    const [canvas, setCanvas] = React.useState<fabric.Canvas>(null);
    const onAddObject = (e: fabric.IEvent) => {
        e.target.hasBorders = e.target.hasControls = e.target.evented = tools.currentTool !== "draw";
    }

    React.useEffect(() => {
        const canvasElement = document.getElementById("shotput-canvas-container");
        if (canvasElement.children.length === 0 && !canvas) {
            screenshot.screenshotCanvas.id = "shotput-canvas";
            canvasElement.appendChild(screenshot.screenshotCanvas);
            const _canvas = new fabric.Canvas('shotput-canvas');
            _canvas.on({
                "object:added": onAddObject
            });
            setCanvas(_canvas);
        }
    });

    React.useEffect(() => {
        if (canvas) {
            switch (tools.currentTool) {
                case "draw":
                    canvas.isDrawingMode = true;
                    break;

                case "shape":
                    canvas.isDrawingMode = false;
                    break;

                case "text":
                    canvas.isDrawingMode = false;
                    break;

                default:
                    canvas.isDrawingMode = false;
                    break;
            }
        }
    }, [tools.currentTool]);

    return <div id={"shotput-canvas-container"} />;
});
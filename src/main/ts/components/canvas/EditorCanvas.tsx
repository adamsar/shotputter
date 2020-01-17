import {observer} from "mobx-react-lite";
import * as React from "react";
import {useStores} from "../../stores";
import {fabric} from "fabric";

interface EditorCanvasProps {

}

export const EditorCanvas = observer<EditorCanvasProps>(() => {
    const { screenshot, tools } = useStores();
    const [canvas, setCanvas] = React.useState<fabric.Canvas>(null);

    React.useEffect(() => {
        const canvasElement = document.getElementById("shotput-canvas-container");
        if (canvasElement.children.length === 0 && !canvas) {
            screenshot.screenshotCanvas.id = "shotput-canvas";
            canvasElement.appendChild(screenshot.screenshotCanvas);
            setCanvas(new fabric.Canvas('shotput-canvas'));
        }
    });

    React.useEffect(() => {
        if (canvas) {
            switch (tools.currentTool) {
                case "draw":
                    canvas.isDrawingMode = true;
                    break;

                case "shape":
                    break;

                case "text":
                    break;

                default:
                    canvas.isDrawingMode = false;
                    break;
            }
        }
    }, [tools.currentTool]);

    return <div id={"shotput-canvas-container"} />;
});
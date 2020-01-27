import {observer, useLocalStore} from "mobx-react-lite";
import * as React from "react";
import {useStores} from "../../stores";
import {fabric} from "fabric";
import {IObservableArray, observable} from "mobx";
import {Rectangle, RectangleEditor} from "./RectangleEditor";
import {TextInputEditor} from "./TextInputEditor";

interface EditorCanvasProps {

}

interface EditorCanvasLocalState {
    savedObjects: IObservableArray<fabric.Object>;
}

export const EditorCanvas = observer<EditorCanvasProps>(() => {
    const { screenshot, tools } = useStores();
    const localStore = useLocalStore<EditorCanvasLocalState>(() => ({
        savedObjects: observable.array([])
    }));

    const [canvas, setCanvas] = React.useState<fabric.Canvas>(null);

    const onAddObject = (e: fabric.IEvent) => {
        e.target.hasBorders = e.target.hasControls = e.target.evented = tools.currentTool !== "draw";
        localStore.savedObjects.push(e.target);
    };

    const onRemoveObject = (e: fabric.IEvent) => {
        localStore.savedObjects.remove(e.target);
    };

    const onAddRectangle = (rect: Rectangle) => {
        const left = Math.min(rect.start.x, rect.end.x);
        const top = Math.min(rect.start.y, rect.end.y);
        const right = Math.max(rect.start.x, rect.end.x);
        const bottom = Math.max(rect.start.y, rect.end.y);
        const rectangle = new fabric.Rect({
            left,
            top,
            width: right - left,
            height: -(top - bottom),
            stroke: 'red',
            strokeWidth: 2,
            fill: 'transparent'
        });
        canvas.add(rectangle);
    };

    React.useEffect(() => {
        const canvasElement = document.getElementById("shotput-canvas-container");
        if (canvasElement.children.length === 0 && !canvas) {
            screenshot.screenshotCanvas.id = "shotput-canvas";
            canvasElement.appendChild(screenshot.screenshotCanvas);
            const _canvas = new fabric.Canvas('shotput-canvas');
            _canvas.on({
                "object:added": onAddObject,
                "object:removed": onRemoveObject
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

    let _Component = null;
    if (canvas) {
        switch (tools.currentTool) {
            case "draw":
                break;
            case "shape":
                _Component = <RectangleEditor canvas={canvas} onAddRectangle={onAddRectangle} />;
                break;
            case "text":
                _Component = <TextInputEditor canvas={canvas}/>;
                break;

        }
    }

    return (
        <>
            <div id={"shotput-canvas-container"} />
            {_Component}
        </>
        );
});
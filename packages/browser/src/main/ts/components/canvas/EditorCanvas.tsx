import {observer, useLocalStore} from "mobx-react-lite";
import * as React from "react";
import {useStores} from "../../stores";
import {fabric} from "fabric";
import {IObservableArray, observable} from "mobx";
import {RectangleEditor} from "./RectangleEditor";
import {TextInputEditor} from "./TextInputEditor";
import {ArrowEditor} from "./ArrowEditor";

interface EditorCanvasProps {

}

interface EditorCanvasLocalState {
    savedObjects: IObservableArray<fabric.Object>;
}


export const EditorCanvas = observer<EditorCanvasProps>(() => {
    const { screenshot, tools } = useStores();
    const localStore = useLocalStore<EditorCanvasLocalState>(() => ({
        savedObjects: observable.array([]),
        currentColor: "DF151A"
    }));

    const [canvas, setCanvas] = React.useState<fabric.Canvas>(null);

    const onAddObject = (e: fabric.IEvent) => {
        e.target.hasBorders = e.target.hasControls = e.target.evented = tools.currentTool !== "draw";
        localStore.savedObjects.push(e.target);
    };

    const onRemoveObject = (e: fabric.IEvent) => {
        localStore.savedObjects.remove(e.target);
    };

    React.useEffect(() => {
        window.document.body.style.overflow = "hidden";
        return () => {
            window.document.body.style.overflow = "inherit";
        };
    }, []);

    React.useEffect(() => {
        const canvasElement = document.getElementById("shotput-canvas-container");
        if (canvasElement.children.length === 0 && !canvas) {
            screenshot.screenshotCanvas.id = "shotput-canvas";
            screenshot.screenshotCanvas.width = window.innerWidth;
            screenshot.screenshotCanvas.height = window.innerHeight;
            canvasElement.appendChild(screenshot.screenshotCanvas);
            const _canvas = new fabric.Canvas(screenshot.screenshotCanvas);
            _canvas.on({
                "object:added": onAddObject,
                "object:removed": onRemoveObject
***REMOVED***);
            setCanvas(_canvas);
        }
        return () => {
            canvas?.dispose();
            while (canvasElement.children.length !== 0) {
                canvasElement.removeChild(canvasElement.children[0]);
***REMOVED***
            setCanvas(null);
            tools.currentTool = null;
        }
    }, []);

    React.useEffect(() => {
        if (tools.currentTool === "draw") {
            canvas.freeDrawingBrush.color = tools.color;
        }
    }, [tools.color]);

    React.useEffect(() => {
        if (canvas) {
            canvas.freeDrawingBrush.width = tools.strokeWidth;
        }
    }, [tools.strokeWidth]);

    React.useEffect(() => {
        if (canvas) {
            switch (tools.currentTool) {
                case "draw":
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush.color = tools.color;
                    canvas.freeDrawingBrush.width = tools.strokeWidth;
                    break;

                case "shape":
                    canvas.isDrawingMode = false;
                    break;

                case "text":
                    canvas.isDrawingMode = false;
                    break;

                case "arrow":
                    canvas.isDrawingMode = false;
                    break;

                default:
                    canvas.isDrawingMode = false;
                    break;
***REMOVED***
        }
    }, [tools.currentTool]);

    let _Component = null;
    if (canvas) {
        switch (tools.currentTool) {
            case "draw":
                break;
            case "shape":
                _Component = <RectangleEditor canvas={canvas} />;
                break;
            case "text":
                _Component = <TextInputEditor canvas={canvas}/>;
                break;
            case "arrow":
                _Component = <ArrowEditor canvas={canvas} />;
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

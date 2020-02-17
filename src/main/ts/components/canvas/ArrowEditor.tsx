import * as React from "react";
import {observer, useLocalStore} from "mobx-react-lite";
import {fabric} from "fabric";
import {useStores} from "../../stores";

interface ArrowEditorProps {
    canvas: fabric.Canvas;
}

const MIN_LENGTH = 20; // min length for arrow

export const ArrowEditor = observer(({canvas}: ArrowEditorProps) => {
    const { tools } = useStores();
    const store = useLocalStore<{
        isDrawing: boolean;
        line: null | fabric.Line;
        lineTip: null | fabric.Triangle;
        start: null | { x: number; y: number; }
    }>(() => ({isDrawing: false, line: null, start: null, lineTip: null}));

    const onMouseDown = (e: fabric.IEvent) => {
        if (!store.isDrawing) {
            const pointer = canvas.getPointer(e.e);
            store.isDrawing = true;
            store.start = {
                x: pointer.x,
                y: pointer.y
            };
        }
    };
    const onMouseUp = () => {
        store.isDrawing = false;
        store.line = null;
        store.lineTip = null;
    };

    const getAngle = (dimensions: {x:number; y: number}): number => {
        const x1 = store.start.x,
            y1 = store.start.y,
            x2 = dimensions.x,
            y2 = dimensions.y,

            dx = x2 - x1,
            dy = y2 - y1;

        let angle = Math.atan2(dy, dx);

        angle *= 180 / Math.PI;
        angle -= 90;
        return angle;
    };

    const onMouseMove = (e: fabric.IEvent) => {
        if (store.isDrawing) {
            const pointer = canvas.getPointer(e.e);
            const dimensions = {
                x: pointer.x,
                y: pointer.y
            };
            const length = Math.sqrt(Math.pow(dimensions.x - store.start.x, 2) + Math.pow(dimensions.y - store.start.y, 2));
            if (length > MIN_LENGTH) {
                if (!store.line) {
                    store.line = new fabric.Line([store.start.x, store.start.y, dimensions.x, dimensions.y], {
                        stroke: tools.color,
                        strokeWidth: tools.strokeWidth
                    });
                    canvas.add(store.line);
                    const headLength = 15 * (tools.strokeWidth / 2);

                    store.lineTip = new fabric.Triangle({
                        angle: getAngle(dimensions),
                        fill: tools.color,
                        top: store.start.y,
                        left: store.start.x,
                        height: headLength,
                        width: headLength,
                        originX: 'center',
                        originY: 'center',
                        selectable: false
                    });

                    canvas.add(store.lineTip);
                } else {
                    store.line.set('x2', dimensions.x);
                    store.line.set('y2', dimensions.y);
                    store.lineTip.angle = getAngle(dimensions);
                    canvas.renderAll();
                }
            } else if (store.line) {
                canvas.remove(store.line);
                canvas.remove(store.lineTip);
                store.line = null;
                store.lineTip = null;
            }
        }
    };

    React.useEffect(() => {
        canvas.on({
            "mouse:down": onMouseDown,
            "mouse:up": onMouseUp,
            "mouse:move": onMouseMove
        });
        canvas.selection = false;
        return () => {
            canvas.off(["mouse:down", "mouse:up"]);
            canvas.selection = true;
        }
    }, []);

    return <></>
});
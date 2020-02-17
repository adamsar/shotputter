import * as React from "react"
import {observer, useLocalStore} from "mobx-react-lite";
import {fabric} from "fabric";
import {useStores} from "../../stores";

export interface Rectangle {
    start: {
        x: number;
        y: number;
    };
    end: {
        x: number;
        y: number;
    }
};

export const RectangleEditor = observer(({canvas}: {canvas: fabric.Canvas;}) => {
    const { tools } = useStores();
    const rectangle = useLocalStore(() => ({
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        },
        isDragging: false
    }));

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
            stroke: tools.color,
            strokeWidth: tools.strokeWidth,
            fill: tools.isFill ? tools.color : 'transparent'
        });
        canvas.add(rectangle);
    };

    const onMouseDown = (e: fabric.IEvent) => {
        const pointer = canvas.getPointer(e.e);
        rectangle.start = {
            x: pointer.x,
            y: pointer.y
        };
        rectangle.isDragging = true
    };
    const onMouseUp = (e: fabric.IEvent) => {
        const pointer = canvas.getPointer(e.e);
        rectangle.end = {
            x: pointer.x,
            y: pointer.y
        };
        rectangle.isDragging = false;
        onAddRectangle(rectangle);
    };

    React.useEffect(() => {
        canvas.on({
            'mouse:up': onMouseUp,
            'mouse:down': onMouseDown
        });
         return () => {
             canvas.off('mouse:down');
             canvas.off('mouse:up');
         }
    });
    return <></>
});
import * as React from "react"
import {useLocalStore} from "mobx-react-lite";

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

export const RectangleEditor = ({canvas, onAddRectangle}: {canvas: fabric.Canvas; onAddRectangle: (rect: Rectangle) => void}) => {
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
}
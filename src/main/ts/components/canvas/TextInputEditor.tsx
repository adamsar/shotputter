import * as React from "react";
import {fabric} from "fabric";
import {useLocalStore} from "mobx-react-lite";

interface TextInputEditorProps {
    canvas: fabric.Canvas;
};

export const TextInputEditor = ({canvas}: TextInputEditorProps) => {
    let store = useLocalStore<{currentText: fabric.IText | null}>(() => ({currentText: null}));
    const onClickMouse = (e: fabric.IEvent) => {
        if (store.currentText) {
            store.currentText.exitEditing();
            store.currentText = null;
        } else {
            const pointer = canvas.getPointer(e.e);
            store.currentText = new fabric.IText('', {
                left: pointer.x,
                top: pointer.y
            });
            canvas.add(store.currentText);
            store.currentText.enterEditing();
        }
    };
    React.useEffect(() => {
        canvas.on({
            'mouse:down': onClickMouse
        });
        return () => {
            store.currentText?.exitEditing();
            canvas.off('mouse:down');
        }
        }, [store.currentText]);
    return <></>
};
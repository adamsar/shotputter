import * as React from "react";
import {fabric} from "fabric";
import {observer, useLocalStore} from "mobx-react-lite";
import {useStores} from "../../stores";

interface TextInputEditorProps {
    canvas: fabric.Canvas;
};

export const TextInputEditor = observer(({canvas}: TextInputEditorProps) => {
    const {tools} = useStores();
    let store = useLocalStore<{currentText: fabric.IText | null}>(() => ({currentText: null}));
    const onClickMouse = (e: fabric.IEvent) => {
        if (store.currentText) {
            store.currentText.exitEditing();
            store.currentText = null;
        } else {
            const pointer = canvas.getPointer(e.e);
            store.currentText = new fabric.IText('', {
                left: pointer.x,
                top: pointer.y,
                stroke: tools.color,
                fontSize: 16
            });
            canvas.add(store.currentText);
            setTimeout(() => store.currentText.enterEditing(), 0);
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
});
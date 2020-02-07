import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../../stores";

export const ShapeSubTools = observer(() => {
    const { tools } = useStores();
    const onClickWidth = (modifier: number) => () => {
        tools.setStrokeWidth(modifier);
    };
    return <div className={"shotput-sub-tools shotput-shape-sub-tools"}>
        <ul>
            <li onClick={onClickWidth(-1)}>
                -Width
            </li>
            <li onClick={onClickWidth(1)}>
                +Width
            </li>
            <li>
                Fill
            </li>
        </ul>
    </div>;
});
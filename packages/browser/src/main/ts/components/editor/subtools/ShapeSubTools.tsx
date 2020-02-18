import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../../stores";

export const ShapeSubTools = observer(() => {
    const { tools } = useStores();
    const onClickWidth = (modifier: number) => () => {
        tools.setStrokeWidth(modifier);
    };
    const onClickFill = () => {
        tools.isFill = !tools.isFill;
    };

    React.useEffect(() => {
        tools.setStrokeWidth();
        tools.isFill = false;
    }, []);

    return <div className={"shotput-sub-tools shotput-shape-sub-tools"}>
        <ul>
            <li onClick={onClickWidth(-1)} className={tools.strokeWidth === 1 ? "shotput-disabled" : undefined}>
                -Width
            </li>
            <li>
                {tools.strokeWidth}px
            </li>
            <li onClick={onClickWidth(1)} className={tools.strokeWidth === 10 ? "shotput-disabled" : undefined}>
                +Width
            </li>
            <li onClick={onClickFill} className={tools.isFill ? "shotput-active" : undefined}>
                Fill
            </li>
        </ul>
    </div>;
});
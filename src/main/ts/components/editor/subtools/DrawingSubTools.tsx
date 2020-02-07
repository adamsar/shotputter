import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../../stores";

export const DrawingSubTool = observer(() => {
    const {tools} = useStores();
    const [isMax, setIsMax] = React.useState(false);
    const [isMin, setIsMin] = React.useState(false);

    React.useEffect(() => tools.setStrokeWidth(), []);

    React.useEffect(() => {
       setIsMin(tools.strokeWidth === 1);
       setIsMax(tools.strokeWidth === 10);
    }, [tools.strokeWidth]);

    const onClick = (modifier: number) => () => {
        tools.setStrokeWidth(modifier);
    };

    return (
        <div className={"shotput-sub-tools shotput-drawing-sub-tool"}>
            <ul>
                <li onClick={onClick(-1)} className={isMin ? "shotput-disabled" : undefined}>
                    -Width
                </li>
                <li>
                    {tools.strokeWidth}
                </li>
                <li onClick={onClick(1)} className={isMax ? "shotput-disabled" : undefined}>
                    +Width
                </li>
            </ul>
        </div>
    )
});
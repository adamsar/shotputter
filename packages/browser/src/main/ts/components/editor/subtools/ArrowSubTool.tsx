import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../../stores";

export const ArrowSubTool = observer(() => {
    const { tools } = useStores();
    const onClickWidth = (modifier: number) => () => {
        tools.setStrokeWidth(modifier);
    };
    React.useEffect(() => {
        tools.setStrokeWidth();
    }, []);
    return (
        <div className={"shotput-sub-tools shotput-text-sub-tools"}>
            <ul>
                <li onClick={onClickWidth(-1)} className={tools.strokeWidth === 1 ? "shotput-disabled" : undefined}>
                    -Width
***REMOVED***
***REMOVED***
                    {tools.strokeWidth}px
***REMOVED***
                <li onClick={onClickWidth(1)} className={tools.strokeWidth === 10 ? "shotput-disabled" : undefined}>
                    +Width
***REMOVED***
***REMOVED***
***REMOVED***
    )
});
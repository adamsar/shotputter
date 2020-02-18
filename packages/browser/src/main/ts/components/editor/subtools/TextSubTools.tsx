import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../../stores";

export const TextSubTools = observer(() => {
    const { tools } = useStores();
    const onClickFontSize = (modifier: number) => () => {
        tools.setFontSize(modifier);
    };
    const onClickBold = () => {
      tools.isBold = !tools.isBold;
    };

    React.useEffect(() => {
        tools.setFontSize();
        tools.isBold = false;
        }, []);

    return (
        <div className={"shotput-sub-tools shotput-text-sub-tools"}>
            <ul>
                <li onClick={onClickFontSize(-1)} className={tools.fontSize === 12 ? "shotput-disabled" : undefined}>
                    -Width
***REMOVED***
***REMOVED***
                    {tools.fontSize}px
***REMOVED***
                <li onClick={onClickFontSize(1)} className={tools.fontSize === 36 ? "shotput-disabled" : undefined}>
                    +Width
***REMOVED***
                <li onClick={onClickBold} className={tools.isBold ? "shotput-active" : undefined}>
                    Bold
***REMOVED***
***REMOVED***
***REMOVED***
    );
});
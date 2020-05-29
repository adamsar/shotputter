import * as React from "react";

interface DelayedActionProps {
    delay: number;
    func: () => void;
}

export const DelayedAction = ({delay, func}: DelayedActionProps) => {
    React.useEffect(() => {
        setTimeout(func, delay)
        return () => {};
    }, [])
    return (<></>)
}

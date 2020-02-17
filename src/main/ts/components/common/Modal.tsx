import * as React from "react";
import {PropsWithChildren} from "react";
import {ModalBackground} from "./ModalBackground";

export const Modal = ({children, onClose}: PropsWithChildren<{onClose?: () => void;}>) => {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const divRef = React.createRef<HTMLDivElement>();

    React.useEffect(() => {
        setWidth(divRef.current?.offsetWidth ?? 0);
        setHeight(divRef.current?.offsetHeight ?? 0);
    });

    return (
        <>
            <ModalBackground onClick = {onClose}/>
            <div className={"shotput-modal-box"} style={{top: `calc(50% - ${height - 16}px)`, left: `calc(50% - ${width - 16}px)`}}>
                <div ref={divRef}> {children} ***REMOVED***
    ***REMOVED***
        </>
    );
};
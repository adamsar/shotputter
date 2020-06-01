import * as React from "react";
import {HTMLProps, PropsWithChildren} from "react";
import {ModalBackground} from "./ModalBackground";

export const Modal = ({children, onClose, className, ...rest}: PropsWithChildren<{onClose?: () => void;} & HTMLProps<HTMLDivElement>>) => {
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
            <div className={"shotput-modal-box " + (className ?? "")} {...rest} style={{top: `calc(50% - ${((height + 32) / 2)}px)`, left: `calc(50% - ${((width + 32) / 2) }px)`}}>
                <div ref={divRef}> {children} ***REMOVED***
    ***REMOVED***
        </>
    );
};

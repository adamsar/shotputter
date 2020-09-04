import * as React from "react";
import {PropsWithChildren} from "react";
import {Modal} from "./Modal";
import {ShotputButton} from "./forms/ShotputButton";

interface ErrorModalProps {
    onClose: () => void;
}

export const ErrorModal = ({onClose, children}: PropsWithChildren<ErrorModalProps>) => {
    return <Modal onClose={onClose} className={"shotput-error-modal"}>
        <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 1l-12 22h24l-12-22zm-1 8h2v7h-2v-7zm1 11.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/></svg>
            <span style={{marginLeft: "1em"}}>ERROR</span></h2>
        <p className={"shotput-error-contents"}>
            {children}
        </p>
        <div className={"shotput-error-button-bar"}>
            <ShotputButton onClick={onClose} color={"white"}>
                Close
            </ShotputButton>
***REMOVED***
    </Modal>
}

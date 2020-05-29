import * as React from "react";
import {PropsWithChildren} from "react";
import {Modal} from "./Modal";
import {FaExclamationTriangle} from "react-icons/fa";
import {ShotputButton} from "./forms/ShotputButton";

interface ErrorModalProps {
    onClose: () => void;
}

export const ErrorModal = ({onClose, children}: PropsWithChildren<ErrorModalProps>) => {
    return <Modal onClose={onClose} className={"shotput-error-modal"}>
        <h2><FaExclamationTriangle/><span style={{marginLeft: "1em"}}>ERROR</span></h2>
        <p className={"shotput-error-contents"}>
            {children}
        </p>
        <div className={"shotput-error-button-bar"}>
            <ShotputButton onClick={onClose} color={"main"}>
                Close
            </ShotputButton>
***REMOVED***
    </Modal>
}

import * as React from "react";
import {HTMLProps, PropsWithChildren} from "react";
import {Modal} from "./Modal";
import {FaCheckCircle} from "react-icons/fa";
import {ShotputButton} from "./forms/ShotputButton";

interface SuccessModalProps extends HTMLProps<HTMLDivElement> {
    onClose: () => void;
}

export const SuccessModal = ({children, onClose, className, ...props}: PropsWithChildren<SuccessModalProps>) => {
    console.log("HERE")
    return <Modal onClose={onClose} className={"shotput-success-modal "} {...props}>
        <div className={"shotput-success-modal-container"}>
            <h2>
                <FaCheckCircle /> <span style={{marginLeft: ".5em"}}>SUCCESS</span>
            </h2>
            <p>
                {children}
            </p>
            <div className={"shotput-success-button-bar"}>
                <ShotputButton onClick={onClose} color={"secondary"}>
                    OK
                </ShotputButton>
    ***REMOVED***
***REMOVED***
    </Modal>
}

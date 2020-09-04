import * as React from "react";
import {HTMLProps, PropsWithChildren} from "react";
import {Modal} from "./Modal";
import {ShotputButton} from "./forms/ShotputButton";

interface SuccessModalProps extends HTMLProps<HTMLDivElement> {
    onClose: () => void;
}

export const SuccessModal = ({children, onClose, className, ...props}: PropsWithChildren<SuccessModalProps>) => {
    return <Modal onClose={onClose} className={"shotput-success-modal "} {...props}>
        <div className={"shotput-success-modal-container"}>
            <h2>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm7 7.457l-9.005 9.565-4.995-5.865.761-.649 4.271 5.016 8.24-8.752.728.685z"/></svg> <span style={{marginLeft: ".5em"}}>SUCCESS</span>
            </h2>
    ***REMOVED***
                {children}
    ***REMOVED***
            <div className={"shotput-success-button-bar"}>
                <ShotputButton onClick={onClose} color={"main"}>
                    OK
                </ShotputButton>
    ***REMOVED***
***REMOVED***
    </Modal>
}

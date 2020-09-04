import {ModalBackground} from "../common/ModalBackground";
import InlineSVG from "react-inlinesvg";
import * as React from "react";

const loader = require("../../../img/loader.svg");

export const Loader = () => (
    <>
        <ModalBackground/>
        <div className={"shotput-loading-modal"}>
            <div className={"shotput-loading-container"}>
                <InlineSVG src={loader} style={{width: "100%"}}/>
            </div>
        </div>
    </>
)
import * as React from "react";
import {PropsWithChildren} from "react";

interface ShotputButtonProps {
    onClick: () => void;
    color: "main" | "secondary" | "white";

}

export const ShotputButton = ({onClick, color, children}: PropsWithChildren<ShotputButtonProps>) => {
    return <div className={"shotput-button " + {
        main: "main-color",
        secondary: "secondary-color",
        white: "white-color"
    }[color]
    } onClick={onClick}>
        {children}
***REMOVED***
}

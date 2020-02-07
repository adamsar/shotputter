import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../../stores";
import {DrawingSubTool} from "./DrawingSubTools";
import {ShapeSubTools} from "./ShapeSubTools";

export const SubToolSection = observer(() => {
    const { tools } = useStores();

    let _Component = null;

    switch (tools.currentTool) {

        case "draw":
            _Component = <DrawingSubTool/>;
            break;

        case "shape":
            _Component = <ShapeSubTools/>;
            break;

        case "text":
            break;

        case "arrow":
            break;

        default:
            _Component = <>Select tool to get started, or just leave a comment.</>;
    }

    return _Component;

});
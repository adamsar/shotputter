import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../../stores";
import {DrawingSubTool} from "./DrawingSubTools";
import {ShapeSubTools} from "./ShapeSubTools";
import {TextSubTools} from "./TextSubTools";
import {ArrowSubTool} from "./ArrowSubTool";

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
            _Component = <TextSubTools/>;
            break;

        case "arrow":
            _Component = <ArrowSubTool/>;
            break;

        default:
            _Component = <>Select tool to get started, or just leave a comment.</>;
    }

    return _Component;

});
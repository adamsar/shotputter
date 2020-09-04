import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {action} from "mobx";
import {colors} from "../../stores/ToolStore";
import {SubToolSection} from "./subtools/SubToolSection";
import {Post} from "@shotputter/common/src/main/ts/services/poster/Post";
// @ts-ignore
import mergeImages from 'merge-images';
import {getSystemInfo} from "../../util/system-utils";

export const EditorToolbar = observer(() => {
    const { global, screenshot, tools } = useStores();
    const [message, setMessage] = React.useState<string>("");
    const divRef = React.createRef<HTMLDivElement>();
    const [width, setWidth] = React.useState<number>(0);

    const onCancel = () => {
        global.displayMode = "unclicked";
        screenshot.resetCanvas();
    };

    const onSubmit = async () => {
        const edits = screenshot.screenshotCanvas.toDataURL("image/png");
        const post: Post = {
            image: await mergeImages([
                screenshot.screenshot,
                edits
            ]),
            message: message || undefined,
            systemInfo: getSystemInfo(window)
        };
        screenshot.setPost(post);
        global.displayMode = "display_poster";
    };

    const onClickTool = (tool: "text" | "draw" | "shape" | "arrow" | null) => action(() => {
        if (tools.currentTool === tool) {
            tools.currentTool = null;
        } else {
            tools.currentTool = tool;
        }
    });

    const onColorClick = (color: string) => action(() => {
        tools.color = color;
    });

    React.useEffect(() => {
        const onResize = () => {
            setWidth(divRef.current?.offsetWidth ?? 0);
        };
        window.addEventListener("resize", onResize);
        if (width === 0) {
            onResize();
        }

        return () => {
            window.removeEventListener("resize", onResize);
        }
    });

    const style = global.isMobile ? {} : {left: `calc(50% - ${width / 2}px)`};

   return (
       <div className={"shotput-editor-toolbar"} style={style} ref={divRef}>
           {
               (!global.isMobile || tools.currentTool) ? (
                   <div className={"shotput-editor-toolbar-top"}>
                       <SubToolSection/>
                   </div>
               ) : null
           }
           <div className={"shotput-editor-toolbar-body"}>
               {
                   (!tools.currentTool || !global.isMobile) ? (
                       <ul className={"shotput-editor-tools"}>
                           <li onClick={onClickTool("shape")} className={tools.currentTool === "shape" ? "active" : null}>
                               Box
                           </li>
                           <li onClick={onClickTool("draw")} className={tools.currentTool === "draw" ? "active" : null}>
                               Draw
                           </li>
                           <li onClick={onClickTool("text")} className={tools.currentTool === "text" ? "active" : null}>
                               Text
                           </li>
                           <li onClick={onClickTool("arrow")} className={tools.currentTool === "arrow" ? "active" : null}>
                               Arrow
                           </li>
                       </ul>
                   )  : null
               }
               {
                   (!global.isMobile || tools.currentTool) ? (
                       <ul className={"shotput-editor-colors"}>
                           {
                               colors.map(color => {
                                   return (
                                       <li key={color} className="shotput-list-color">
                                           <div className={"shotput-list-color-block" + (color === tools.color ? " active" : "")} style={{backgroundColor: color}} onClick={onColorClick(color)}/>
                                       </li>
                                   )
                               })
                           }
                       </ul>
                   ) : null
               }

                   {
                       (!tools.currentTool || !global.isMobile) ? (
                           <div className={"shotput-editor-comment-container"}>
                                <textarea value={message} onChange={({target: {value}}) => setMessage(value)} placeholder={"Comments"}/>
                           </div>
                       ) : null
                   }
           </div>
           <div className={"shotput-editor-toolbar-bottom"}>

               {
                   (!tools.currentTool || !global.isMobile) ? (
                       <>
                           <div className={"shotput-editor-button cancel-button"} onClick={onCancel}>
                               Cancel
                           </div>
                           <div className={"shotput-editor-button submit-button"} onClick={onSubmit}>
                               Submit
                           </div>
                       </>
                   ) : (
                       <div className={"shotput-editor-button cancel-button"} onClick={onClickTool(null)}>
                           Done editing
                       </div>
                   )
               }

           </div>
       </div>
   );
});

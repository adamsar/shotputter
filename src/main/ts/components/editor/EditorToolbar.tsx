import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {action} from "mobx";

export const EditorToolbar = observer(() => {
    const { global, screenshot, tools } = useStores();
    const commentRef = React.createRef<HTMLTextAreaElement>();
    const divRef = React.createRef<HTMLDivElement>();
    const [width, setWidth] = React.useState<number>(0);

    const onCancel = () => {
        global.displayMode = "unclicked";
        screenshot.resetCanvas();
    };

    const onSubmit = () => {

    };

    const onClickTool = (tool: "text" | "draw" | "shape") => action(() => {
        if (tools.currentTool === tool) {
            tools.currentTool = null;
        } else {
            tools.currentTool = tool;
        }
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

    const style = {left: `calc(50% - ${width / 2}px)`};

   return (
       <div className={"shotput-editor-toolbar"} style={style} ref={divRef}>
           <div className={"shotput-editor-toolbar-top"}>
               Select tool to get started, or just leave a comment.
           </div>
           <div className={"shotput-editor-toolbar-body"}>
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
               </ul>
               <div className={"shotput-editor-comment-container"}>
                   <textarea ref={commentRef} placeholder={"Comments"}/>
               </div>
           </div>
           <div className={"shotput-editor-toolbar-bottom"}>
               <div className={"shotput-editor-button cancel-button"} onClick={onCancel}>
                   Cancel
               </div>
               <div className={"shotput-editor-button submit-button"} onClick={onSubmit}>
                   Submit
               </div>
           </div>
       </div>
   );
});
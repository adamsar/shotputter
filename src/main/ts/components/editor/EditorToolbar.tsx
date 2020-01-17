import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";

export const EditorToolbar = observer(() => {
    const { global, screenshot } = useStores();
    const commentRef = React.createRef<HTMLTextAreaElement>();
    const divRef = React.createRef<HTMLDivElement>();
    const [width, setWidth] = React.useState<number>(0);

    const onCancel = () => {
        global.displayMode = "unclicked";
        screenshot.resetCanvas();
    };

    const onSubmit = () => {

    };

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
                   <li>
                       Box
                   </li>
                   <li>
                       Draw
                   </li>
                   <li>
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
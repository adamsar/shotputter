import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {action} from "mobx";
import {colors} from "../../stores/ToolStore";
import {SubToolSection} from "./subtools/SubToolSection";
import {Post} from "../../services/poster/Post";

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
        screenshot.screenshotCanvas.style.backgroundImage = `url(${screenshot.screenshot})`;
        const post: Post = {
            image: screenshot.screenshotCanvas.toDataURL("image/jpeg"),
            message: commentRef.current.value || undefined
        };
        screenshot.setPost(post);
        global.displayMode = "display_poster";
    };

    const onClickTool = (tool: "text" | "draw" | "shape" | "arrow") => action(() => {
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

    const style = {left: `calc(50% - ${width / 2}px)`};

   return (
       <div className={"shotput-editor-toolbar"} style={style} ref={divRef}>
           <div className={"shotput-editor-toolbar-top"}>
               <SubToolSection/>
   ***REMOVED***
           <div className={"shotput-editor-toolbar-body"}>
               <ul className={"shotput-editor-tools"}>
                   <li onClick={onClickTool("shape")} className={tools.currentTool === "shape" ? "active" : null}>
                       Box
   ***REMOVED***
                   <li onClick={onClickTool("draw")} className={tools.currentTool === "draw" ? "active" : null}>
                       Draw
   ***REMOVED***
                   <li onClick={onClickTool("text")} className={tools.currentTool === "text" ? "active" : null}>
                       Text
   ***REMOVED***
                   <li onClick={onClickTool("arrow")} className={tools.currentTool === "arrow" ? "active" : null}>
                       Arrow
   ***REMOVED***
   ***REMOVED***
               <ul className={"shotput-editor-colors"}>
                   {
                       colors.map(color => {
                           return (
                               <li key={color} className="shotput-list-color">
                                   <div className={"shotput-list-color-block" + (color === tools.color ? " active" : "")} style={{backgroundColor: color}} onClick={onColorClick(color)}/>
               ***REMOVED***
                           )
           ***REMOVED***)
       ***REMOVED***
   ***REMOVED***
               <div className={"shotput-editor-comment-container"}>
                   <textarea ref={commentRef} placeholder={"Comments"}/>
       ***REMOVED***
   ***REMOVED***
           <div className={"shotput-editor-toolbar-bottom"}>
               <div className={"shotput-editor-button cancel-button"} onClick={onCancel}>
                   Cancel
       ***REMOVED***
               <div className={"shotput-editor-button submit-button"} onClick={onSubmit}>
                   Submit
       ***REMOVED***
   ***REMOVED***
   ***REMOVED***
   );
});
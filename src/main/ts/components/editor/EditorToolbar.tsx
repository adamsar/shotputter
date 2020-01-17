import * as React from "react";
import {observer} from "mobx-react-lite";

export const EditorToolbar = observer(() => {
    const commentRef = React.createRef<HTMLTextAreaElement>();

    const onCancel = () => {

    };

    const onSubmit = () => {

    };

   return <div className={"shotput-editor-toolbar-container"}>
       <div className={"shotput-editor-toolbar"}>
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
   </div>;
});
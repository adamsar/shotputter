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
   ***REMOVED***
           <div className={"shotput-editor-toolbar-body"}>
               <ul className={"shotput-editor-tools"}>
   ***REMOVED***
                       Box
   ***REMOVED***
   ***REMOVED***
                       Draw
   ***REMOVED***
   ***REMOVED***
                       Text
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
   ***REMOVED***;
});
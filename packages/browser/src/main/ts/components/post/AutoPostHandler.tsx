import * as React from "react";
import {useState} from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Loader} from "../processor/Loader";
import {SuccessModal} from "../common/SuccessModal";
import {pipe} from "fp-ts/pipeable";
import {
    applyTemplate,
    defaultSlackTemplate,
    defaultTemplate,
    defaultUnformattedTemplate,
    SlackParams
} from "../../config/ShotputBrowserConfig";
import {mapSlackError} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {chain} from "fp-ts/TaskEither";
import {sequenceT} from "fp-ts/lib/Apply";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {sequence} from "fp-ts/Array";
import {isLeft} from "fp-ts/These";
import {ErrorModal} from "../common/ErrorModal";

interface AutoPostHandlerProps {
   onBack: () => void;
}

export const AutoPostHandler = observer(({onBack}: AutoPostHandlerProps) => {
   const {screenshot, global} = useStores();
   const [posting, setPosting] = useState<boolean>(true);
   const [successful, setSuccessful] = useState<boolean>(false);
   const [errors, setErrors] = useState<any[]>([]);

   React.useEffect(() => {
      const tasks = global.autoPosters.map((autoPoster) => {
         const post = screenshot.post;
         const logs = (global.appOptions.captureLogs ? {logs: screenshot.logBuffer.peekN(10).join("\n")} : {})
         const fileName = `[Screenshot]-${new Date().toISOString()}.png`;

         switch (autoPoster) {
             case "google":
                 return pipe(
                     applyTemplate(
                         global.appOptions?.google?.template ?? defaultUnformattedTemplate,
                         {
                             message: post.message,
                             metadata: JSON.stringify(post.metadata ?? {}, null, 2),
                             systemInfo: JSON.stringify(post.systemInfo, null, 2),
                             ...logs
             ***REMOVED***
                     ),
                     taskEitherExtensions.mapLeftString,
                     chain(message => pipe(
                         global.googleService.post({message, image: post.image}),
                         taskEitherExtensions.mapLeftString)
                     ),
                     taskEitherExtensions.mapLeftValidation()
                 )

            case "slack":
               return pipe(
                   applyTemplate(
                       global.appOptions.slack.slackTemplate ?? (
                           typeof global.appOptions.service === "object" ? global.appOptions.service.messageTemplate ?? defaultSlackTemplate : defaultSlackTemplate
                       ),
                       {
                          message: post.message,
                          metadata: JSON.stringify(post.metadata ?? {}, null, 2),
                          systemInfo: JSON.stringify(post.systemInfo, null, 2),
                           ...logs
           ***REMOVED*** as SlackParams),
                   mapSlackError,
                   chain(message => global.slackService.uploadFile({
                      channels: [global.appOptions.slack.defaultChannel],
                      message,
                      fileName,
                      base64File: post.image
       ***REMOVED***)),
                   taskEitherExtensions.mapLeftValidation()
               );

            case "custom":
               return pipe(
                   global.customRequestService.sendPost(post),
                   taskEitherExtensions.mapLeftValidation()
               );

             case "github":
               return pipe(
                   sequenceT(taskEitherExtensions.errorValidation)(
                       pipe(
                           applyTemplate(
                           typeof global.appOptions.service === "object" ? global.appOptions.service.messageTemplate ?? defaultTemplate : defaultTemplate,
                           {
                               message: post.message,
                               metadata: JSON.stringify(post.metadata ?? {}, null, 2),
                               systemInfo: JSON.stringify(post.systemInfo, null, 2),
                               ...logs
               ***REMOVED***),
                           taskEitherExtensions.mapLeftValidation()
                       ),
                       pipe(
                           applyTemplate(global.appOptions.github.titleTemplate, {}),
                           taskEitherExtensions.mapLeftValidation()
                       )
                   ),
                    chain(([message, title]) => pipe(
                            global.githubService.postIssue({
                                post: {...screenshot.post, message},
                                repo: global.appOptions.github.defaultRepo,
                                owner: global.appOptions.github.defaultOwner,
                                title,
                                labels: global.appOptions.github.defaultLabels ?? []
                ***REMOVED***),
                            taskEitherExtensions.mapLeftValidation()
                        )
                    ))
         }
      })
       const result = sequence(taskEitherExtensions.errorValidation)(tasks)();
       result.then((eitherResult) => {
           if (isLeft(eitherResult)) {
               setErrors(eitherResult.left);
           } else {
               setSuccessful(true)
           }
       }).catch(error => setErrors([error]))
         .finally(() => setPosting(false));
   }, []);

   if (posting) {
      return <Loader/>;
   } else {
      if (successful) {
         return (
             <SuccessModal onClose={onBack}>
                Screenshot successfully posted
             </SuccessModal>
         )
      } else if (errors.length > 0) {
            return (
                <ErrorModal onClose={onBack}>
                    Error when posting!<br/>
                    <code className={"shotput-code"}>
                        {errors.map(x => JSON.stringify(x, null, 2)).join("\n")}
                    </code>
                </ErrorModal>
            )
      } else {
         return null;
      }
   }
});

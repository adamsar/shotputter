import * as React from "react";
import {useState} from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Loader} from "../processor/Loader";
import {SuccessModal} from "../common/SuccessModal";
import {pipe} from "@shotputter/common/node_modules/fp-ts/lib/pipeable";
import {
    applyTemplate,
    defaultSlackTemplate,
    defaultTemplate,
    defaultUnformattedTemplate
} from "../../config/ShotputBrowserConfig";
import {mapSlackError} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {chain, TaskEither} from "@shotputter/common/node_modules/fp-ts/lib/TaskEither";
import {sequenceT} from "@shotputter/common/node_modules/fp-ts/lib/Apply";
import {array} from "@shotputter/common/node_modules/fp-ts/lib/Array";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {isLeft} from "@shotputter/common/node_modules/fp-ts/lib/These";
import {ErrorModal} from "../common/ErrorModal";
import {JiraPoster$Post$Params} from "@shotputter/common/src/main/ts/services/poster/jira/JiraPoster";

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
         const fileName = `[Screenshot]-${new Date().toISOString()}.png`;
         const post = screenshot.post;
         const overriddenTemplate = typeof global.appOptions.service === "object" ? global.appOptions.service?.messageTemplate : undefined;

         switch (autoPoster) {
             case "jira":
                 const jiraOptions = global.appOptions.jira;
                 return pipe(
                   sequenceT(taskEitherExtensions.errorValidation)(
                       pipe(
                           applyTemplate(jiraOptions.template ?? overriddenTemplate ?? defaultSlackTemplate, screenshot.templateParams) as TaskEither<any, string>,
                           taskEitherExtensions.mapLeftValidation()
                       ),
                       jiraOptions.defaultSummary ? pipe(
                           applyTemplate(jiraOptions.defaultSummary, {}),
                           taskEitherExtensions.mapLeftValidation()
                           ) : taskEitherExtensions.right("New report from Shotputter"),
                       pipe(
                           global.jiraService.getCreateMetadata(),
                           taskEitherExtensions.mapLeftValidation()
                       )
                   ),
                     chain(([message, summary, createMetadata]) => {
                         const project = createMetadata.projects.find(({id, name}) => jiraOptions.defaultProject === id || jiraOptions.defaultProject === name);
                         if (!project) {
                             return taskEitherExtensions.left([{type: "configuration", error: `Jira default project ${jiraOptions.defaultProject} not found in metadata`}]);
                         }
                         const issuetype = project.issuetypes.find(({id, name}) => jiraOptions.defaultProject === id || jiraOptions.defaultProject === name);
                         if (!issuetype) {
                             return taskEitherExtensions.left([{type: "configuration", error: `Jira default issue type ${jiraOptions.defaultIssueType} not found in project configuration`}])
                         }
                         const post: JiraPoster$Post$Params = {
                             message,
                             project: project.id,
                             issuetype: issuetype.id,
                             image: screenshot.post.image
                         };
                         if (issuetype.fields['summary']?.required) {
                             post.summary = summary;
                         }
                         if (issuetype.fields['priorityId']?.required) {
                             const priority = issuetype.fields['priorityId'].allowedValues.find(({id, name}) => id === jiraOptions.defaultPriority || name === jiraOptions.defaultPriority)?.id
                             if (priority) {
                                 post.priorityId = jiraOptions.defaultPriority;
                             } else {
                                 return taskEitherExtensions.left([{type: "configuration", error: `Jira default priority required but not found`}]);
                             }
                         }
                         return pipe(global.jiraService.post(post), taskEitherExtensions.mapLeftValidation())
                     })
                 );
             case "google":
                 return pipe(
                     applyTemplate(
                         global.appOptions?.google?.template ?? defaultUnformattedTemplate,
                         screenshot.templateParams
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
                       global.appOptions.slack.template ?? (
                           typeof global.appOptions.service === "object" ? global.appOptions.service.messageTemplate ?? defaultSlackTemplate : defaultSlackTemplate
                       ),screenshot.templateParams),
                   mapSlackError,
                   chain(message => global.slackService.uploadFile({
                      channels: [global.appOptions.slack.defaultChannel],
                      message,
                      fileName,
                      base64File: post.image
                   })),
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
                           screenshot.templateParams),
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
                            }),
                            taskEitherExtensions.mapLeftValidation()
                        )
                    ))
         }
      })
       const result = array.sequence(taskEitherExtensions.errorValidation)(tasks)();
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

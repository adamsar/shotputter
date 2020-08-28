import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {Async} from "react-async";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {applyTemplate, defaultUnformattedTemplate} from "../../config/ShotputBrowserConfig";
import {Loader} from "../processor/Loader";
import {ErrorModal} from "../common/ErrorModal";
import {SuccessModal} from "../common/SuccessModal";
import {pipe} from "fp-ts/pipeable";
import {chain} from "fp-ts/es6/TaskEither";
import {TaskEither} from "fp-ts/TaskEither";

interface GoogleModalProps {

    onClose: () => void;

}

export const GoogleModal = observer(({onClose}: GoogleModalProps) => {
    const {global, screenshot} = useStores()
    const post = screenshot.post;
    const promise = React.useMemo(taskEitherExtensions.toDeferFn(
            pipe(
                applyTemplate(
                global.appOptions?.google?.template ?? defaultUnformattedTemplate,
                screenshot.templateParams
            ) as TaskEither<any, string>,
                chain(message => global.googleService.post({message, image: post.image}))
    )), []);
    return (
        <Async promise={promise}>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
            <Async.Rejected>{(errors) => (
                <ErrorModal onClose={onClose}>
                    Error posting to google<br/>
                    <code className={"shotput-code"}>
                        {JSON.stringify(errors, null, 2)}
                    </code>
                </ErrorModal>
            )}</Async.Rejected>
            <Async.Fulfilled>{(_) => (
                <SuccessModal onClose={onClose}>
                    Sucessfully posted to Google!
                </SuccessModal>
            )}</Async.Fulfilled>
        </Async>
    )
})

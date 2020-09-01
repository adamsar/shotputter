import * as React from "react";
import {useStores} from "../../stores";
import {Async} from "react-async";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {Loader} from "../processor/Loader";
import {HttpError} from "@shotputter/common/src/main/ts/services/HostedRequester";
import {ErrorModal} from "../common/ErrorModal";
import {SuccessModal} from "../common/SuccessModal";
import {DelayedAction} from "../common/DelayedAction";
import {observer} from "mobx-react-lite";

interface CustomModalProps {
    onClose: () => void;
}

export const CustomModal = observer(({onClose}: CustomModalProps) => {
    const { screenshot, global } = useStores();

    return (
        <Async promiseFn={taskEitherExtensions.toDeferFn(global.customRequestService.sendPost({...screenshot.post, ...screenshot.logs}))}>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
            <Async.Rejected>{ (error: HttpError) => (
                <ErrorModal onClose={onClose}>
                    <h4>Error posting to custom screenshot handler</h4>
                    <code className={"shotput-code"}>
                        {JSON.stringify(error, null, 2)}
                    </code>
                </ErrorModal>
            )}</Async.Rejected>
            <Async.Fulfilled>{_ => (
                <SuccessModal onClose={onClose}>
                    Successfully submitted screenshot data.
                    <DelayedAction delay={5000} func={onClose}/>
                </SuccessModal>
            )}</Async.Fulfilled>
        </Async>
    )
})

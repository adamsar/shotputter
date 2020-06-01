import * as React from "react";
import {observer} from "mobx-react-lite";
import {Async} from "react-async";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {useStores} from "../../stores";
import {DownloadError} from "@shotputter/common/src/main/ts/services/poster/DownloadPoster";
import {ErrorModal} from "../common/ErrorModal";
import {Loader} from "../processor/Loader";
import {SuccessModal} from "../common/SuccessModal";

export const DownloadModal = observer(({onClose, onFinish}: {onClose: () => void; onFinish: () => void;}) => {
    const {global, screenshot} = useStores();
    return (
        <Async promiseFn={taskEitherExtensions.toDeferFn(global.downloadService.send(screenshot.post))}>
            <Async.Initial>

            </Async.Initial>
            <Async.Rejected>{ (error: DownloadError) => (
                    <ErrorModal onClose={onClose}>
                        Error downloading screenshot!<br/>
                        <code>
                            {JSON.stringify(error)}
                            <br/>

                        </code>
                        System info<br/>
                        <code>
                            {JSON.stringify(screenshot.post.systemInfo)}
                        </code>
                    </ErrorModal>
            )}</Async.Rejected>
            <Async.Fulfilled>{ _ => (
                <SuccessModal onClose={onFinish}>
                    <h4>
                        Post successfully downloaded! For the developer, you can send the following system information
                        to help with debugging!
                    </h4>
                    <code>
                        {JSON.stringify(screenshot.post.systemInfo)}
                    </code><br/>
                    {screenshot.post.metadata ? (
                        <>
                        <h4>Metadata</h4>
                        <code>
                            {JSON.stringify(screenshot.post.metadata, null, 2)}
                        </code>
                        </>
                    ) : null}
                    {screenshot.post.logs?.length ?? 0 > 0 ? (
                        <>
                            <h4>Logs</h4>
                            <code>
                                {screenshot.post.logs.join("\n")}
                            </code>
                        </>
                    ) : null}
                </SuccessModal>
            )}</Async.Fulfilled>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
        </Async>
    )
});

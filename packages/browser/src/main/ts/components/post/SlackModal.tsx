import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {SlackChannel, SlackError} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {Loader} from "../processor/Loader";
import {Modal} from "../common/Modal";
import {Async, IfFulfilled, IfInitial, IfPending, IfRejected, useAsync} from "react-async";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {SuccessModal} from "../common/SuccessModal";
import {ErrorModal} from "../common/ErrorModal";
import {codeBlockString} from "../../util/system-utils";
import {useMemo} from "react";

export const SlackModal = observer(({/*onFinish,*/ onClose}: {onFinish: () => void; onClose: () => void;}) => {
    const {global, screenshot} = useStores();
    const [channel, setChannel] = React.useState<string>();
    const slackService = global.slackService;
    const postChannelState =  useAsync({
        deferFn: ([channels]: [string[]]) => taskEitherExtensions.toDeferFn(slackService.uploadFile({
            channels,
            message: (screenshot.post.message || "") + (
                `\nSystem info: \n${codeBlockString(JSON.stringify(screenshot.post.systemInfo || "", null, 2))}`
            ) + (
                screenshot.post.metadata ? `\nMetadata\n${codeBlockString(JSON.stringify(screenshot.post.metadata, null, 2))}` : ""
            ) + (
                (screenshot.post.logs?.length ?? 0 > 0) ? `\nLogs\n${codeBlockString(screenshot.post.logs.join("\n"))}` : ""
                )
            ,
            fileName: `[Screenshot]-${new Date().toISOString()}.jpg`,
            base64File: screenshot.post.image
        }))()
    });
    const defaultChannel = global.appOptions.slack?.defaultChannel;
    const doPost = () => {
        postChannelState.run([channel || defaultChannel]);
    }

    const promise = useMemo(taskEitherExtensions.toDeferFn(slackService.listChannels()), []);

    return (
        <Async promise={promise}>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
            <Async.Rejected>{(error:SlackError) =>
                <ErrorModal onClose={onClose}>
                    There was an error loading channels from slack<br/>
                    <code>
                        {JSON.stringify(error)}
                    </code>
                </ErrorModal>
            }</Async.Rejected>
            <Async.Fulfilled>{ (channels: SlackChannel[]) => (
                <>
                    <IfPending state={postChannelState}>
                        <Loader/>
                    </IfPending>
                    <IfRejected state={postChannelState}>{ (error: SlackError, _) => (
                        <ErrorModal onClose={onClose}>
                            There was an error posting to Slack<br/>
                            <code>
                                {JSON.stringify(error ?? {})}
                            </code>
                        </ErrorModal>
                    )}</IfRejected>
                    <IfInitial state={postChannelState}>
                        <Modal className={"shotput-slack-modal"} onClose={onClose}>
                            <h3>Post to Slack</h3>
                            <div>
                                <div className={"shotput-label"}>
                                    Channel
                                </div>
                                <div className={"shotput-field-container"}>
                                    <select
                                        defaultValue={defaultChannel ? channels.find(({name}) => name === defaultChannel)?.id ?? channels[0]?.id : channels[0]?.id}
                                        onChange={(value) => setChannel(value.target.value)}>
                                        {
                                            channels.map(channel => (
                                                <option key={channel.id} value={channel.id}>#{channel.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className={"shotput-bottom-buttons"}>
                                    <span className={"shotput-bottom-button"} onClick={onClose}>Back</span>
                                    <span className={"shotput-bottom-button"} onClick={doPost}>Post</span>
                                </div>
                            </div>
                        </Modal>
                    </IfInitial>
                    <IfFulfilled state={postChannelState}>{ _ => (
                        <>
                            <SuccessModal onClose={onClose}>
                                Successfully posted message to #{channel} in Slack!
                            </SuccessModal>
                        </>
                    )}</IfFulfilled>
                    </>
            )
            }</Async.Fulfilled>
        </Async>
    )
});

import * as React from "react";
import {useMemo} from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {SlackChannel, SlackError} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {Loader} from "../processor/Loader";
import {Modal} from "../common/Modal";
import {Async, IfFulfilled, IfInitial, IfPending, IfRejected, useAsync} from "react-async";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {SuccessModal} from "../common/SuccessModal";
import {ErrorModal} from "../common/ErrorModal";
import {pipe} from "fp-ts/lib/pipeable";
import {applyTemplate, defaultSlackTemplate} from "../../config/ShotputBrowserConfig";
import {TaskEither, chain} from "fp-ts/lib/TaskEither";
import {ShotputButton} from "../common/forms/ShotputButton";

export const SlackModal = observer(({/*onFinish,*/ onClose}: {onFinish: () => void; onClose: () => void;}) => {
    const {global, screenshot} = useStores();
    const [channel, setChannel] = React.useState<string>();
    const slackService = global.slackService;
    const postChannelState =  useAsync({
        deferFn: ([channels]: [string[]]) => taskEitherExtensions.toDeferFn(pipe(
            applyTemplate(global.appOptions.slack?.template ?? defaultSlackTemplate, screenshot.templateParams) as TaskEither<any, string>,
            chain(message => slackService.uploadFile({
            channels,
            message,
            fileName: `[Screenshot]-${new Date().toISOString()}.png`,
            base64File: screenshot.post.image
        }))))()
    });
    const defaultChannel = global.appOptions.slack?.defaultChannel;
    const doPost = () => {
        postChannelState.run([channel || defaultChannel]);
    }
    const staticChannel = global.appOptions.slack?.forceChannel && global.appOptions.slack?.defaultChannel;

    const promise = useMemo(taskEitherExtensions.toDeferFn(slackService.listChannels()), []);

    return (
        <Async promise={promise}>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
            <Async.Rejected>{(error:SlackError) =>
                <ErrorModal onClose={onClose}>
                    There was an error loading channels from slack<br/>
                    <code className={"shotput-code"}>
                        {JSON.stringify(error, null, 2)}
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
                            <code className={"shotput-code"}>
                                {JSON.stringify(error ?? {}, null, 2)}
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
                                    {
                                        staticChannel ? (
                                            <p>
                                                #{channels.find(({name}) => name === defaultChannel).name}
                                            </p>
                                        ) : (
                                            <select
                                                defaultValue={defaultChannel ? channels.find(({name}) => name === defaultChannel)?.id ?? channels[0]?.id : channels[0]?.id}
                                                onChange={(value) => setChannel(value.target.value)}>
                                                {
                                                    channels.map(channel => (
                                                        <option key={channel.id} value={channel.id}>#{channel.name}</option>
                                                    ))
                                                }
                                            </select>
                                        )
                                    }

                                </div>
                                <div className={"shotput-bottom-buttons"}>
                                    <ShotputButton onClick={onClose} color={"white"}>Back</ShotputButton>
                                    <ShotputButton onClick={doPost} color={"main"}>Post</ShotputButton>
                                </div>
                            </div>
                        </Modal>
                    </IfInitial>
                    <IfFulfilled state={postChannelState}>{ _ => (
                            <SuccessModal onClose={onClose}>
                                Successfully posted message to #{channel} in Slack!
                            </SuccessModal>
                    )}</IfFulfilled>
                    </>
            )
            }</Async.Fulfilled>
        </Async>
    )
});

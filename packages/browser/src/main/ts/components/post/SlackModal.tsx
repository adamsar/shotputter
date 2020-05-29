import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {SlackChannel, SlackError} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {Loader} from "../processor/Loader";
import {Modal} from "../common/Modal";
import {Async, useAsync} from "react-async";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {SuccessModal} from "../common/SuccessModal";

export const SlackModal = observer(({/*onFinish,*/ onClose}: {onFinish: () => void; onClose: () => void;}) => {
    const {global, screenshot} = useStores();
    const [channel, setChannel] = React.useState<string>();
    const slackService = global.slackService;
    const {run: sendMessage, ...postChannelState} =  useAsync({
        deferFn: ([channels]: [string[]]) => taskEitherExtensions.toDeferFn(slackService.uploadFile({
            channels,
            message: screenshot.post.message + `\n${JSON.stringify(screenshot.post.systemInfo)}`,
            fileName: `[Screenshot]-${new Date().toISOString()}.jpg`,
            base64File: screenshot.post.image
        }))()
    });
    const defaultChannel = global.appOptions.slack?.defaultChannel;
    const doPost = () => {
        sendMessage([channel]);
    }

    return (
        <Async promiseFn={taskEitherExtensions.toDeferFn(slackService.listChannels())}>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
            <Async.Rejected>{(error:SlackError) =>
                JSON.stringify(error)
            }</Async.Rejected>
            <Async.Fulfilled>{ (channels: SlackChannel[]) =>
                <Async state={postChannelState}>
                    <Async.Pending>
                        <Loader/>
                    </Async.Pending>
                    <Async.Rejected> { (error: SlackError) =>
                        JSON.stringify(error)
                    }
                    </Async.Rejected>
                    <Async.Initial>
                <Modal onClose={onClose}>
                    <h3>Post to Slack</h3>
                    <div>
                        <div className={"shotput-label"}>
                            Channel
                        </div>
                        <div className={"shotput-field-container"}>
                            <select defaultValue={defaultChannel ? channels.find(({name}) => name === defaultChannel)?.id ?? channels[0]?.id : channels[0]?.id} onChange={(value) => setChannel(value.target.value)}>
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
                    </Async.Initial>
                    <Async.Fulfilled>{ _ => (
                        <>
                            <SuccessModal onClose={onClose}>
                                Successfully posted message to #{channel} in Slack!
                            </SuccessModal>
                        </>
                    )}</Async.Fulfilled>
                </Async>
            }</Async.Fulfilled>
        </Async>
    )
});

    /*

    React.useEffect(() => {
        setLoadingChannels(true);
        global.slackService.listChannels().then((channels) => {
            setLoadingChannels(false);
            setChannels(channels);
            setChannel(channels[0].id);
        }).catch((error) => {
            console.log(error);
            setErrored(true);
        })
    }, []);

    const onPost = () => {
        setLoadingChannels(true);
        poster.send(screenshot.post).then(() => {
            onFinish();
        }).catch(error => {
            console.log(error);
            setErrored(true)
        })
    };

    if (loadingChannels) {
        return <Loader/>;
    } else if (errored) {
        return <Modal>
            ERROR!
        </Modal>
    } else {
        return (

        );
    }
});

     */

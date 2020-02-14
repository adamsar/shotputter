import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {SlackChannel} from "../../services/poster/slack/SlackPoster";
import {Loader} from "../processor/Loader";
import {Modal} from "../common/Modal";

export const SlackModal = observer(({onFinish, onClose}: {onFinish: () => void; onClose: () => void;}) => {
    const {  global, screenshot } = useStores();
    const [loadingChannels, setLoadingChannels] = React.useState(false);
    const [channels, setChannels] = React.useState<SlackChannel[]>([]);
    const [errored, setErrored] = React.useState<boolean>(false);
    const channelRef = React.createRef<HTMLSelectElement>();
    const poster = screenshot.slackPoster;

    const setChannel = (channel: string) => {
        // @ts-ignore
        poster.setChannel(channel)
    };

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
            <Modal onClose={onClose}>
                <h3>Post to Slack</h3>
                <div>
                    <div className={"shotput-label"}>
                        Channel
                    </div>
                    <div className={"shotput-field-container"}>
                        <select ref={channelRef} onChange={(value) => setChannel(value.target.value)}>
                            {
                                channels.map(channel => (
                                    <option key={channel.id} value={channel.id}>#{channel.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={"shotput-bottom-buttons"}>
                        <span className={"shotput-bottom-button"} onClick={onClose}>Back</span>
                        <span className={"shotput-bottom-button"} onClick={onPost}>Post</span>
                    </div>
                </div>
            </Modal>
        );
    }
});
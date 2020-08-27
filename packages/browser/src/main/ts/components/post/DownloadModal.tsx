import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {SuccessModal} from "../common/SuccessModal";
import {TabbedComponent} from "../common/layout/TabbedComponent";
import {Tab} from "../common/layout/Tab";

export const DownloadModal = observer(({onFinish}: {onClose: () => void; onFinish: () => void;}) => {
    const { screenshot} = useStores();
    return (
        <SuccessModal onClose={onFinish}>
            <h4>
                Download with the link below<br/>
                System information is available with the tabs below.
            </h4>
            <a className={"shotput-download-link"} download={`Screenshot-${new Date().toISOString()}.png`} href={screenshot.post.image}>Download screenshot</a>
            <TabbedComponent>
                <Tab tabKey={"systemInfo"} title={"System Info"}>
                    <code className={"shotput-code"}>
                        {JSON.stringify(screenshot.post.systemInfo, null, 2)}
                    </code>
                </Tab>
            {screenshot.post.metadata ? (
                <Tab tabKey={"metadata"} title={"Metadata"}>
                    <code className={"shotput-code"}>
                        {JSON.stringify(screenshot.post.metadata, null, 2)}
                    </code>
                </Tab>
            ) : null}
            {screenshot.post.logs?.length ?? 0 > 0 ? (
                <Tab tabKey={"log"} title={"Logs"}>
                    <code className={"shotput-code"}>
                        {screenshot.post.logs.join("\n")}
                    </code>
                </Tab>
            ) : null}
            </TabbedComponent>
        </SuccessModal>
    )
});

import * as React from "react";
import {AppOptions} from "../../App";
import * as Stacktrace from "stacktrace-js";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {isLeft} from "fp-ts/lib/Either";
import {ErrorModal} from "../common/ErrorModal";
import {SystemInfo} from "@shotputter/common/src/main/ts/models/SystemInfo";
import {getSystemInfo} from "../../util/system-utils";

interface WindowErrorComponentProps {
    appOptions: AppOptions
}

type ErrorHandler = (opts: {message: string; systemInfo: SystemInfo;}) => void;

export const WindowErrorComponent = observer(({appOptions}: WindowErrorComponentProps) => {
    const { global } = useStores();
    const [failure, setFailure] = React.useState<string>();

    if (appOptions.errorReporting?.enabled) {
        React.useEffect(() => {
            const handlers: ErrorHandler[] = [];
            if (appOptions.errorReporting?.consoleLog?.enabled) {
                handlers.push(({message, systemInfo}) => {
                    console.log(message);
                    console.log("SYSTEM INFO:");
                    console.log(systemInfo);
    ***REMOVED***);
***REMOVED***
            if (appOptions?.errorReporting?.slack?.enabled && global.slackService) {
                handlers.push(async ({message, systemInfo}) => {
                    const result = await global.slackService.postMessage({
                        message: `${message}\nSystem info:\n\`\`\`${JSON.stringify(systemInfo, null, 2)}\`\`\``,
                        // @ts-ignore
                        channel: appOptions.errorReporting.slack.channel
        ***REMOVED***)();
                    if (isLeft(result)) {
                        setFailure(JSON.stringify(result.left, null, 2));
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

            const handleError: OnErrorEventHandler = (msg: string, _2: any, _3: any, _4: any, error: Error ) => {
                Stacktrace.fromError(error).then(async stackframes => {
                    const message = msg + "\n" + stackframes.map((sf) => sf.toString()).join('\n');
                    const systemInfo = getSystemInfo(window);
                    return Promise.all(handlers.map(async (x) => await x({message, systemInfo})));
    ***REMOVED***).catch(setFailure);
***REMOVED***;

            const oldEventHandler = window.onerror;
            window.onerror = (a, b, c, d, e) => {
                oldEventHandler?.(a, b, c, d, e);
                handleError(a, b, c, d, e);
***REMOVED***
            return () => window.onerror = oldEventHandler;
        }, []);
    }

    React.useEffect(() => {
        if (failure) {
            setTimeout(() => setFailure(undefined), 5000);
        }
    }, [failure]);

    if (failure) {
        return <ErrorModal onClose={() => setFailure(undefined)}>
            Error logging an error! Oh no!<br/>
            <code>
                { JSON.stringify(failure, null, 2) }
            </code>
        </ErrorModal>
    } else {
        return <></>;
    }
})

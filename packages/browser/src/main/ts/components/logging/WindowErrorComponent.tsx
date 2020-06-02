import * as React from "react";
import {AppOptions} from "../../App";
import * as Stacktrace from "stacktrace-js";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {isLeft} from "fp-ts/lib/Either";
import {ErrorModal} from "../common/ErrorModal";
import {SystemInfo} from "@shotputter/common/src/main/ts/models/SystemInfo";
import {codeBlockString, getSystemInfo} from "../../util/system-utils";

interface WindowErrorComponentProps {
    appOptions: AppOptions
}

type ErrorHandler = (opts: {message: string; systemInfo: SystemInfo; logs?: string[];}) => void;

export const WindowErrorComponent = observer(({appOptions}: WindowErrorComponentProps) => {
    const { global, screenshot } = useStores();
    const [failure, setFailure] = React.useState<string>();

    if (appOptions.errorReporting?.enabled) {
        React.useEffect(() => {
            const handlers: ErrorHandler[] = [];
            if (appOptions.errorReporting?.consoleLog?.enabled) {
                handlers.push(({message, systemInfo}) => {
                    console.log(message);
                    console.log("SYSTEM INFO:");
                    console.log(systemInfo);
                });
            }
            if (appOptions?.errorReporting?.slack?.enabled && global.slackService) {
                handlers.push(async ({message, systemInfo, logs}) => {
                    const result = await global.slackService.postMessage({
                        message: `${message}
                        System info
                        ${codeBlockString(JSON.stringify(systemInfo, null, 2))}
                        ${logs && logs.length > 0 ? `
                        
                        Logs
                        ${codeBlockString(logs.join("\n"))}
                        ` : ""}
                        `,
                        // @ts-ignore
                        channel: appOptions.errorReporting.slack.channel
                    })();
                    if (isLeft(result)) {
                        setFailure(JSON.stringify(result.left, null, 2));
                    }
                });
            }
            if (appOptions?.errorReporting?.customEndpointEnabled && global.customRequestService) {
                handlers.push(async ({message, systemInfo, logs}) => {
                    const result = await global.customRequestService.sendError(
                        message,
                        systemInfo,
                        logs)();
                    if (isLeft(result)) {
                        setFailure(JSON.stringify(result.left, null, 2))
                    }
                })
            }

            const handleError: OnErrorEventHandler = (msg: string, _2: any, _3: any, _4: any, error: Error ) => {
                Stacktrace.fromError(error).then(async stackframes => {
                    const message = msg + "\n" + stackframes.map((sf) => sf.toString()).join('\n');
                    const systemInfo = getSystemInfo(window);
                    const logs = (screenshot.logBuffer.size() ?? 0) > 0 ? screenshot.logBuffer.peekN(screenshot.logBuffer.size()) : undefined
                    return Promise.all(handlers.map(async (x) => await x({message, systemInfo, logs})));
                }).catch(setFailure);
            };

            const oldEventHandler = window.onerror;
            window.onerror = (a, b, c, d, e) => {
                oldEventHandler?.(a, b, c, d, e);
                handleError(a, b, c, d, e);
            }
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

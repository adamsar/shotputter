import * as React from "react";
import * as Stacktrace from "stacktrace-js";
import {StackFrame} from "stacktrace-js";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {ErrorModal} from "../common/ErrorModal";
import {SystemInfo} from "@shotputter/common/src/main/ts/models/SystemInfo";
import {getSystemInfo} from "../../util/system-utils";
import {applyTemplate, defaultSlackTemplate, ShotputBrowserConfig} from "../../config/ShotputBrowserConfig";
import {pipe} from "fp-ts/pipeable";
import {chain, fromIO, getTaskValidation, TaskEither} from "fp-ts/lib/TaskEither";
import {mapSlackError, SlackServiceClient} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {HttpPoster} from "@shotputter/common/src/main/ts/services/poster/http/HttpPoster";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {getMonoid, sequence} from "fp-ts/lib/Array";
import {isLeft} from "fp-ts/Either";

interface WindowErrorComponentProps {
    appOptions: ShotputBrowserConfig;
}

type ErrorHandler = (opts: {metadata: object; message: string; systemInfo: SystemInfo; logs?: string[];}) => TaskEither<any, any>

const logHandler: ErrorHandler = ({metadata, message, systemInfo}) => fromIO(() => {
    console.log(message);
    console.log("SYSTEM INFO:");
    console.log(systemInfo);
    console.log("METADATA:")
    console.log(metadata);
});

const slackHandler = (appOptions: ShotputBrowserConfig, slack?: SlackServiceClient): ErrorHandler | undefined => {
    if (appOptions.errorReporting?.enabled && appOptions.errorReporting?.slack?.enabled && slack) {
        // @ts-ignore
        return ({message, metadata, systemInfo, logs}) => pipe(
            applyTemplate(
                appOptions?.errorReporting?.template ?? defaultSlackTemplate,
                {
                    message,
                    systemInfo,
                    logs,
                    metadata,
                    systemInfoString: JSON.stringify(systemInfo, null, 2),
                    logsString: logs?.join("\n"),
                    metadataString: JSON.stringify(metadata, null, 2)
                }
            ),
                mapSlackError,
                chain(message => slack.postMessage({
                    message,
                    channel: appOptions?.errorReporting.slack.channel
                }))
        )
    }
}

const customHandler = (appOptions: ShotputBrowserConfig): ErrorHandler | undefined => {
    if (appOptions?.errorReporting?.customEndpoint && appOptions?.errorReporting?.enabled) {
        const requester = HttpPoster(appOptions.errorReporting.customEndpoint)
        return ({message, metadata, systemInfo, logs}) => requester.sendError(
            message, systemInfo, metadata, logs
        )
    }
}

export const WindowErrorComponent = observer(({appOptions}: WindowErrorComponentProps) => {
    const { global, screenshot } = useStores();
    const [failure, setFailure] = React.useState<string>();

    if (appOptions.errorReporting?.enabled) {
        React.useEffect(() => {
            const handlers: ErrorHandler[] = [];
            if (appOptions.errorReporting?.consoleLog?.enabled) {
                handlers.push(logHandler);
            }
            const _slackHandler = slackHandler(appOptions, global.slackService);
            if (_slackHandler) handlers.push(_slackHandler);
            const _customHandler = customHandler(appOptions);
            if (_customHandler) handlers.push(_customHandler);

            const handleError: OnErrorEventHandler = async (msg: string, _2: any, _3: any, _4: any, error: Error) => {
                const results = await pipe(
                    taskEitherExtensions.fromPromise(Stacktrace.fromError(error)) as TaskEither<any, StackFrame[]>,
                    chain((stackFrames: StackFrame[]) => {
                        const metadata = screenshot.metadata;
                        const message = msg + "\n" + stackFrames.map((sf) => sf.toString()).join('\n');
                        const systemInfo = getSystemInfo(window);
                        const logs = (screenshot.logBuffer.size() ?? 0) > 0 ? screenshot.logBuffer.peekN(screenshot.logBuffer.size()) : undefined
                        return sequence(getTaskValidation(getMonoid<any>()))(handlers.map(fn => fn({
                            message,
                            systemInfo,
                            logs,
                            metadata})))
                    })
                )()
                if (isLeft(results)) {
                    setFailure(results.left.join("\n"))
                }
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
            <code className={"shotput-code"}>
                { JSON.stringify(failure, null, 2) }
            </code>
        </ErrorModal>
    } else {
        return <></>;
    }
})

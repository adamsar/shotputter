import * as React from "react";
import * as Stacktrace from "stacktrace-js";
import {StackFrame} from "stacktrace-js";
import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import {ErrorModal} from "../common/ErrorModal";
import {SystemInfo} from "@shotputter/common/src/main/ts/models/SystemInfo";
import {getSystemInfo} from "../../util/system-utils";
import {applyTemplate, defaultSlackTemplate, ShotputBrowserConfig} from "../../config/ShotputBrowserConfig";
import {pipe} from "fp-ts/lib/pipeable";
import {chain, taskEither, getTaskValidation, TaskEither} from "fp-ts/lib/TaskEither";
import {
    HostedSlackService,
    mapSlackError
} from "@shotputter/common/src/main/ts/services/poster/slack/SlackPoster";
import {HttpPoster} from "@shotputter/common/src/main/ts/services/poster/http/HttpPoster";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {getMonoid, array} from "fp-ts/lib/Array";
import {isLeft} from "fp-ts/lib/Either";
import {HostedRequester} from "@shotputter/common/src/main/ts/services/HostedRequester";
import {HostedGooglePoster} from "@shotputter/common/src/main/ts/services/poster/google/GooglePoster";

interface WindowErrorComponentProps {
    appOptions: ShotputBrowserConfig;
}

type ErrorHandler = (opts: {metadata: object; message: string; systemInfo: SystemInfo; logs?: string[];}) => TaskEither<any, any>

const logHandler: ErrorHandler = ({metadata, message, systemInfo}) => taskEither.fromIO(() => {
    console.log(message);
    console.log("SYSTEM INFO:");
    console.log(systemInfo);
    console.log("METADATA:")
    console.log(metadata);
});

const slackHandler = (appOptions: ShotputBrowserConfig): ErrorHandler | undefined => {
    if (appOptions.service !== false && appOptions.errorReporting?.enabled && appOptions.errorReporting?.slack?.enabled) {
        const slack = HostedSlackService(new HostedRequester(appOptions.service.url));
        // @ts-ignore
        return ({message, metadata, systemInfo, logs}) => pipe(
            applyTemplate(
                appOptions.errorReporting?.slack?.template ?? appOptions?.errorReporting?.template ?? defaultSlackTemplate,
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

const googleHandler = (appOptions: ShotputBrowserConfig): ErrorHandler | undefined => {
    if (appOptions.service !== false && appOptions.errorReporting?.enabled && appOptions.errorReporting?.google?.enabled) {
        const google = HostedGooglePoster(new HostedRequester(appOptions.service.url));
        return ({message, metadata, systemInfo, logs}) => {
            return pipe(
                applyTemplate(
                appOptions.errorReporting?.google?.template ?? appOptions.errorReporting?.template ?? defaultSlackTemplate,
                {
                    message,
                    systemInfo,
                    logs,
                    metadata,
                    systemInfoString: JSON.stringify(systemInfo, null, 2),
                    logsString: logs?.join("\n"),
                    metadataString: JSON.stringify(metadata, null, 2)
                }) as TaskEither<any, string>,
                chain(message => google.message({ message }))
            )
        }
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
    const { screenshot } = useStores();
    const [failure, setFailure] = React.useState<string>();

    if (appOptions.errorReporting?.enabled) {
        React.useEffect(() => {
            const handlers: ErrorHandler[] = [];
            if (appOptions.errorReporting?.consoleLog?.enabled) {
                handlers.push(logHandler);
            }
            const _slackHandler = slackHandler(appOptions);
            if (_slackHandler) handlers.push(_slackHandler);
            const _customHandler = customHandler(appOptions);
            if (_customHandler) handlers.push(_customHandler);
            const _googleHandler = googleHandler(appOptions);
            if (_googleHandler) handlers.push(_googleHandler);

            const handleError: OnErrorEventHandler = async (msg: string, _2: any, _3: any, _4: any, error: Error) => {
                const results = await pipe(
                    taskEitherExtensions.fromPromise(Stacktrace.fromError(error)) as TaskEither<any, StackFrame[]>,
                    chain((stackFrames: StackFrame[]) => {
                        const metadata = screenshot.metadata;
                        const message = msg + "\n" + stackFrames.map((sf) => sf.toString()).join('\n');
                        const systemInfo = getSystemInfo(window);
                        const logs = (screenshot.logBuffer.size() ?? 0) > 0 ? screenshot.logBuffer.peekN(screenshot.logBuffer.size()) : undefined
                        return array.sequence(getTaskValidation(getMonoid<any>()))(handlers.map(fn => fn({
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

import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import React, {ChangeEvent} from "react";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {Async, useAsync} from "react-async";
import {
    JiraIssueType,
    JiraPoster$Post$Params,
    jiraPosterPostDecode,
    JiraPriority,
    JiraProject
} from "@shotputter/common/src/main/ts/services/poster/jira/JiraPoster";
import {Loader} from "../processor/Loader";
import {ErrorModal} from "../common/ErrorModal";
import {Modal} from "../common/Modal";
import {sequenceT} from "fp-ts/Apply";
import {pipe} from "fp-ts/pipeable";
import {applyTemplate, defaultTemplate} from "../../config/ShotputBrowserConfig";
import {map, TaskEither} from "fp-ts/TaskEither";
import {ioUtils} from "@shotputter/common/src/main/ts/util/io-utils";
import {fold} from "fp-ts/lib/Either";
import {SuccessModal} from "../common/SuccessModal";

export interface JiraPostModal$Props {
    onClose: () => void;
}

const JiraField$Project = ({projects, onChange, defaultProject}: { projects: JiraProject[], onChange: (project: JiraProject) => void, defaultProject?: string }) => {
    const [project, setProject] = React.useState<JiraProject>(defaultProject ? projects.find(({id, key, name}) => id === defaultProject || key === defaultProject || name === defaultProject) ?? projects[0] : projects[0]);
    // Change project
    React.useEffect(() => {
        onChange(project);
    }, [project]);

    const onSelect = ({target: {value: id}}: ChangeEvent<HTMLSelectElement>) => {
        const _project = projects.find(({id: otherId}) => otherId=== id);
        setProject(_project);
    };

    return (
        <div className={"shotput-field-container"}>
            <div className={"shotput-label"}>
                Project
            </div>
            <div className={"shotput-field"}>
                <select onChange={onSelect} value={project.id}>
                    {
                        projects.map(({name, id}) => (
                            <option value={id} key={id}>{name}</option>

                        ))
                    }
                </select>
            </div>
        </div>
    )
}

interface JiraField$IssuetypeParams {
    issuetypes: JiraIssueType[];
    onChange: (issuetype: JiraIssueType) => void;
    defaultIssuetype?: string;
}

const JiraField$Issuetype = ({issuetypes, onChange, defaultIssuetype}: JiraField$IssuetypeParams) => {
    const [issuetype, setIssuetype] = React.useState<JiraIssueType>(defaultIssuetype ? issuetypes.find(({id, name}) => id === defaultIssuetype || name === defaultIssuetype) ?? issuetypes[0] : issuetypes[0]);
    // Change issue type
    React.useEffect(() => {
        onChange(issuetype);
    }, [issuetype]);

    const onSelect = ({target: {value: id}}: ChangeEvent<HTMLSelectElement>) => {
        const _issuetype = issuetypes.find(({id: otherId}) => otherId=== id);
        setIssuetype(_issuetype)
    };

    return (
        <div className={"shotput-field-container"}>
            <div className={"shotput-label"}>
                Issue Type
            </div>
            <div className={"shotput-field"}>
                <select onChange={onSelect} value={issuetype.id}>
                    {
                        issuetypes.map(({name, id}) => (
                            <option value={id} key={id}>{name}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

const JiraField$Summary = ({error, onChange, defaultSummary}:{onChange: (summary: string) => void; defaultSummary?: string, error?: string;}) => {
    const [summary, setSummary] = React.useState(defaultSummary);
    React.useEffect(() => {
        onChange(summary?.trim() ?? undefined);
    }, [summary]);

    const onSummaryChange = ({target: {value: summary}}: ChangeEvent<HTMLInputElement>) => {
        setSummary(summary);
    }

    return (
        <div className={"shotput-field-container"}>
            <div className={"shotput-label"}>
                Summary
            </div>
            <div className={"shotput-field"}>
                <input type={"text"} onChange={onSummaryChange} value={summary}/>
            </div>
            {
                error ? (
                    <p className={"shotput-error-contents"}>
                        {error}
                    </p>
                ) : null
            }
        </div>
    )
}

const JiraField$Priority = ({priorities, onChange, defaultPriority}: {priorities: JiraPriority[]; onChange: (priority: JiraPriority) => void; defaultPriority?: string}) => {
    const [priority, setPriority] = React.useState<JiraPriority>(defaultPriority ? priorities.find(({id, name}) => id === defaultPriority || name === defaultPriority) ?? priorities[0] : priorities[0]);
    // Change issue type
    React.useEffect(() => {
        onChange(priority);
    }, [priority]);

    const onSelect = ({target: {value: id}}: ChangeEvent<HTMLSelectElement>) => {
        const _priority = priorities.find(({id: otherId}) => otherId === id);
        setPriority(_priority);
    };

    return (
        <div className={"shotput-field-container"}>
            <div className={"shotput-label"}>
                Priority
            </div>
            <div className={"shotput-field"}>
                <select onChange={onSelect} value={priority.id}>
                    {
                        priorities.map(({name, id}) => (
                            <option value={id}>{name}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

interface JiraPostModal$Errors {
    summary?: string;
}

export const JiraPostModal = observer(({onClose}: JiraPostModal$Props) => {
    const { global, screenshot } = useStores();
    const [project, setProject] = React.useState<string>(global.appOptions.jira.defaultProject);
    const [issuetype, setIssuetype] = React.useState<string>(global.appOptions.jira.defaultProject);
    const [summary, setSummary] = React.useState<string>(global.appOptions.jira.defaultSummary);
    const [priority, setPriority] = React.useState<string>(global.appOptions.jira.defaultPriority);
    const [errors, setErrors] = React.useState<JiraPostModal$Errors>({});
    const [running, setRunning] = React.useState(false);
    const bootstrapPromise: Promise<[JiraIssueType[], JiraProject[], JiraPriority[]]> = React.useMemo(() => {
        return taskEitherExtensions.toDeferFn(sequenceT(taskEitherExtensions.errorValidation)(
                taskEitherExtensions.mapLeftValidation()(global.jiraService.listIssueTypes()),
                taskEitherExtensions.mapLeftValidation()(global.jiraService.listProjects()),
                taskEitherExtensions.mapLeftValidation()(global.jiraService.listPriorities())
        ))()
    }, []);
    const postState = useAsync({deferFn: ([form]: [JiraPoster$Post$Params]) => {
        return taskEitherExtensions.toDeferFn(global.jiraService.post(form))()
    }});

    React.useEffect(() => {
        return () => {
            setPriority(undefined);
            setIssuetype(undefined);
            setSummary(undefined);
            setProject(undefined);
            setRunning(false);
        }
    },[])
    const onChangeProject = (project: JiraProject) => setProject(project.id);
    const onChangeIssuetype = (issuetype: JiraIssueType) => setIssuetype(issuetype.id);
    const onChangeSummary = (summary: string) => setSummary(summary);
    const onChangePriority = (priority: JiraPriority) => setPriority(priority.id);
    const onClickPost = () => {
        const logs = (global.appOptions.captureLogs ? {logs: screenshot.logBuffer.peekN(10).join("\n")} : {})
        pipe(
            applyTemplate(
                global.appOptions.jira.template ?? defaultTemplate,
                {
                    message: screenshot.post.message,
                    metadata: JSON.stringify(screenshot.post.metadata ?? {}, null, 2),
                    systemInfo: JSON.stringify(screenshot.post.systemInfo, null, 2),
                    ...logs
                }) as TaskEither<any, string>,
            map((message) => {
                const params: JiraPoster$Post$Params = {
                    project,
                    issuetype,
                    summary,
                    priorityId: priority,
                    message,
                    image: screenshot.post.image
                }
                return pipe(
                    jiraPosterPostDecode.decode(params),
                    ioUtils.toErrorObject,
                    fold(
                        errors => setErrors({summary: errors.summary}),
                        form => {
                            postState.run(form);
                            setRunning(true);
                        }
                        ));
            }))();
    }
    const onClickBack = () => onClose();

    return (
        <Async promise={bootstrapPromise}>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
            <Async.Rejected>{(error) => (
                <ErrorModal onClose={onClose}>
                    An error occurred while fetching data for JIRA<br/>
                    <code className={"shotput-code"}>
                        {JSON.stringify(error, null, 2)}
                    </code>
                </ErrorModal>
            )}</Async.Rejected>
            <Async.Fulfilled>{([issueTypes, projects, priorities]) => (
                <Async {...postState}>
                    <Async.Pending>
                        {
                            running ? (
                                <Loader/>
                            ) : (
                                <Modal>
                                    <h3>Post to Jira</h3>
                                    <div className={"shotput-jira-field"}>
                                        <JiraField$Project projects={projects} onChange={onChangeProject}/>
                                        <JiraField$Issuetype issuetypes={issueTypes} onChange={onChangeIssuetype}/>
                                        <JiraField$Summary onChange={onChangeSummary} error={errors?.summary}/>
                                        <JiraField$Priority priorities={priorities} onChange={onChangePriority}/>
                                    </div>
                                    <div className={"shotput-bottom-buttons"}>
                                        <div className={"shotput-bottom-button"} onClick={onClickPost}>
                                            Post
                                        </div>
                                        <div className={"shotput-bottom-button"} onClick={onClickBack}>
                                            Close
                                        </div>
                                    </div>
                                </Modal>
                            )
                        }

                    </Async.Pending>
                    <Async.Rejected>{error => (
                        <ErrorModal onClose={onClose}>
                            Error occurred while posting issue to jira <br/>
                            <code className={"shotput-code"}>
                                {JSON.stringify(error, null, "")}
                            </code>
                        </ErrorModal>
                    )}</Async.Rejected>
                    <Async.Fulfilled>{() => <SuccessModal onClose={onClose}>
                        Successfully posted to JIRA!
                    </SuccessModal>}</Async.Fulfilled>
                </Async>
            )}</Async.Fulfilled>
        </Async>
    )
})

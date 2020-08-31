import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import React, {ChangeEvent} from "react";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {Async, useAsync} from "react-async";
import {
    JiraCreateMetadata,
    JiraField,
    JiraIssueType,
    JiraPoster$Post$Params,
    jiraPosterPostDecode,
    JiraPriority,
    JiraProject
} from "@shotputter/common/src/main/ts/services/poster/jira/JiraPoster";
import {Loader} from "../processor/Loader";
import {ErrorModal} from "../common/ErrorModal";
import {Modal} from "../common/Modal";
import {pipe} from "fp-ts/pipeable";
import {applyTemplate, defaultTemplate} from "../../config/ShotputBrowserConfig";
import {map, TaskEither} from "fp-ts/TaskEither";
import {ioUtils} from "@shotputter/common/src/main/ts/util/io-utils";
import {fold} from "fp-ts/lib/Either";
import {SuccessModal} from "../common/SuccessModal";
import {ShotputButton} from "../common/forms/ShotputButton";

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
    ***REMOVED***
            <div className={"shotput-field"}>
                <select onChange={onSelect} value={project.id}>
                    {
                        projects.map(({name, id}) => (
                            <option value={id} key={id}>{name}</option>

                        ))
        ***REMOVED***
                </select>
    ***REMOVED***
***REMOVED***
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
    ***REMOVED***
            <div className={"shotput-field"}>
                <select onChange={onSelect} value={issuetype.id}>
                    {
                        issuetypes.map(({name, id}) => (
                            <option value={id} key={id}>{name}</option>
                        ))
        ***REMOVED***
                </select>
    ***REMOVED***
***REMOVED***
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
    ***REMOVED***
            <div className={"shotput-field"}>
                <input type={"text"} onChange={onSummaryChange} value={summary}/>
    ***REMOVED***
            {
                error ? (
                    <p className={"shotput-error-contents"}>
                        {error}
                    </p>
                ) : null
***REMOVED***
***REMOVED***
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
    ***REMOVED***
            <div className={"shotput-field"}>
                <select onChange={onSelect} value={priority.id}>
                    {
                        priorities.map(({name, id}) => (
                            <option value={id}>{name}</option>
                        ))
        ***REMOVED***
                </select>
    ***REMOVED***
***REMOVED***
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
    const [bootstrap, setBootstrap] = React.useState<boolean>(false);
    const bootstrapPromise: Promise<JiraCreateMetadata> = React.useMemo(() => {
        return taskEitherExtensions.toDeferFn(global.jiraService.getCreateMetadata())()
    }, []);
    const bootstrapState = useAsync({promise: bootstrapPromise});
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
    },[]);
    React.useEffect(() => {
        const data = bootstrapState.data
        const {defaultProject, defaultIssueType, defaultSummary, defaultPriority } = global.appOptions.jira
        if (!bootstrap && data) {
            setBootstrap(true);
            const project = data.projects.find(({name, id}) => name === defaultProject || id == defaultProject) ?? data.projects[0];
            setProject(project?.id);
            const issuetype = project.issuetypes?.find(({name, id}) => name === defaultIssueType || id === defaultIssueType) ?? project?.issuetypes[0];
            if (issuetype) {
                setIssuetype(issuetype?.id);
                const hasSummary: boolean = Boolean(issuetype?.fields['summary']);
                const hasPriority: boolean = Boolean(issuetype?.fields['priorityId']);
                if (hasSummary && defaultSummary) {
                    setSummary(defaultSummary);
    ***REMOVED***
                if (hasPriority) {
                    // @ts-ignore
                    const priorities: JiraPriority[] = issuetype.fields['priorityId']?.allowedValues;
                    if (priorities) {
                        const priority = priorities.find(({id, name}) => id === defaultPriority || name === defaultPriority) ?? priorities[0];
                        setPriority(priority.id)
        ***REMOVED***
    ***REMOVED***
***REMOVED***
        }
    }, [bootstrapState.data]);
    const onChangeProject = (project: JiraProject) => {
        setProject(project.id);
        setIssuetype(undefined);
        setSummary(undefined);
        setPriority(undefined);
    }
    const onChangeIssuetype = (issuetype: JiraIssueType) => setIssuetype(issuetype.id);
    const onChangeSummary = (summary: string) => setSummary(summary);
    const onChangePriority = (priority: JiraPriority) => setPriority(priority.id);
    const onClickPost = () => {
        pipe(
            applyTemplate(
                global.appOptions.jira.template ?? defaultTemplate,
                screenshot.templateParams) as TaskEither<any, string>,
            map((message) => {
                const params: JiraPoster$Post$Params = {
                    project,
                    issuetype,
                    summary,
                    priorityId: priority,
                    message,
                    image: screenshot.post.image
    ***REMOVED***
                return pipe(
                    jiraPosterPostDecode.decode(params),
                    ioUtils.toErrorObject,
                    fold(
                        errors => setErrors({summary: errors.summary}),
                        form => {
                            postState.run(form);
                            setRunning(true);
            ***REMOVED***
                        ));
***REMOVED***))();
    }
    const onClickBack = () => onClose();

    return (
        <Async {...bootstrapState}>
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
            <Async.Fulfilled>{(createMetadata: JiraCreateMetadata) => {
                const _project: JiraProject & { issuetypes: (JiraIssueType & { fields: { [p: string]: JiraField } })[] } = createMetadata.projects.find(({id, name}) => id === project || name === project)
                const forcedProject = global.appOptions.jira?.forceProject && _project;
                const _issuetype: JiraIssueType & { fields: { [p: string]: JiraField } } = _project?.issuetypes.find(({id}) => id === issuetype)
                const forcedIssuetype = global.appOptions.jira?.forceIssueType && _issuetype;
                const summaryRequired: boolean = _issuetype?.fields['summary']?.required;
                const priorityRequired: boolean = _issuetype?.fields['priorityId']?.required;
                // @ts-ignore
                const priorities: JiraPriority[] = _issuetype?.fields['priorityId']?.allowedValues;
                return (
                    <Async {...postState}>
                        <Async.Pending>
                            {
                                running ? (
                                    <Loader/>
                                ) : (
                                    <Modal>
                                        <h3>Post to Jira</h3>
                                        <div className={"shotput-jira-field"}>
                                            {
                                                forcedProject ? (
                                                    <p>{forcedProject.name}</p>
                                                ) : _project ? (
                                                    <JiraField$Project defaultProject={_project.id} projects={createMetadata.projects} onChange={onChangeProject}/>
                                                ) : null
                                ***REMOVED***
                                            {
                                                forcedIssuetype ? (
                                                    <p>{forcedIssuetype.name}</p>
                                                ) : _issuetype ? (
                                                    <JiraField$Issuetype defaultIssuetype={_issuetype.id} issuetypes={_project.issuetypes} onChange={onChangeIssuetype}/>
                                                ) : null
                                ***REMOVED***
                                            {
                                                summaryRequired ? (
                                                    <JiraField$Summary defaultSummary={summary ?? ""} onChange={onChangeSummary} error={errors?.summary}/>
                                                ) : null
                                ***REMOVED***
                                            {
                                                priorityRequired ? (
                                                    <JiraField$Priority priorities={priorities} onChange={onChangePriority}/>
                                                ) : null
                                ***REMOVED***

                                ***REMOVED***
                                        <div className={"shotput-bottom-buttons"}>
                                            <ShotputButton onClick={onClickPost} color={"main"}>
                                                Post
                                            </ShotputButton>
                                            <ShotputButton onClick={onClickBack} color={"white"}>
                                                Close
                                            </ShotputButton>
                                ***REMOVED***
                                    </Modal>
                                )
                ***REMOVED***

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
                )
***REMOVED***}</Async.Fulfilled>
        </Async>
    )
})

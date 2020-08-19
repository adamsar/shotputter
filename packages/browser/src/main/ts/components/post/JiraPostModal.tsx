import {observer} from "mobx-react-lite";
import {useStores} from "../../stores";
import React from "react";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {Async} from "react-async";
import {JiraIssueType, JiraProject} from "@shotputter/common/src/main/ts/services/poster/jira/JiraPoster";
import {Loader} from "../processor/Loader";
import {ErrorModal} from "../common/ErrorModal";
import { Modal } from "../common/Modal";

export interface JiraPostModal$Props {
    onClose: () => void;
}

export const JiraPostModal = observer(({onClose}: JiraPostModal$Props) => {
    const { global } = useStores();
    const issueTypesPromise = React.useMemo(() => taskEitherExtensions.toDeferFn(
        global.jiraService.listIssueTypes()
        )(), []);
    const projectPromise = React.useMemo(() => taskEitherExtensions.toDeferFn(
        global.jiraService.listProjects()
    )(), [])

    return (
        <Async promise={issueTypesPromise}>
            <Async.Pending>
                <Loader/>
            </Async.Pending>
            <Async.Rejected>{(error) => (
                <ErrorModal onClose={onClose}>
                    An error occurred while fetching issue types for Jira<br/>
                    <code className={"shotput-code"}>
                        {JSON.stringify(error, null, 2)}
                    </code>
                </ErrorModal>
            )}</Async.Rejected>
            <Async.Fulfilled>{(issueTypes: JiraIssueType[]) => (
                <Async promise={projectPromise}>
                    <Async.Fulfilled>{(projects: JiraProject[]) => (
                        <Modal>
                            {JSON.stringify(issueTypes)}
                            {JSON.stringify(projects)}
                        </Modal>
                    )}</Async.Fulfilled>
                    <Async.Pending>
                        <Loader/>
                    </Async.Pending>
                    <Async.Rejected>{(error) => (
                        <ErrorModal onClose={onClose}>
                            An error has occurred while fetching while fetching projects for Jira <br/>
                            <code className={""}>
                                {JSON.stringify(error, null, 2)}
                            </code>
                        </ErrorModal>
                    )}</Async.Rejected>
                </Async>
            )}</Async.Fulfilled>
        </Async>
    )
})

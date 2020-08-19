import {JiraConfig} from "../server";
import * as express from "express";
// @ts-ignore
import JiraApi from "jira-client";
import {_route} from "../routing/route";
import {pipe} from "fp-ts/lib/pipeable";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {map, mapLeft, chain} from "fp-ts/TaskEither";
import {Ok, ServerError} from "../routing/responses";
import {
    JiraPoster$Post$Params,
    jiraPosterPostDecode
} from "@shotputter/common/src/main/ts/services/poster/jira/JiraPoster";
import {ioUtils} from "@shotputter/common/src/main/ts/util/io-utils";
import {BadDecodeResponse} from "../routing/response-errors";
import {ImageUploader} from "@shotputter/common/src/main/ts/services/images/uploader";

const jiraFormat = (postData: JiraPoster$Post$Params, imageUrl: string) => ({
    project: {
        key: postData.project
    },
    summary: postData.summary,
    issuetype: {
        name: postData.issuetype
    },
    priority: {
        id: postData.priorityId
    },
    description: `
    !${imageUrl}!
    ${postData.message}
    `
})

export const getJiraRouter = (jiraConfig: JiraConfig, imageUploader: ImageUploader) => {
    const router = express.Router();
    const jira = new JiraApi({
        protocol: 'https',
        username: jiraConfig.username,
        password: jiraConfig.password,
        apiVersion: '2',
        strictSSL: true,
        host: jiraConfig.host
    });
    router.post("/post", _route(({req}) => {
        return pipe(
            ioUtils.toTaskEither(req.body, jiraPosterPostDecode, BadDecodeResponse),
            chain((postData) => pipe(
                imageUploader.uploadImage(postData.image),
                mapLeft(error => ServerError(error)),
                chain(imageUrl => pipe(
                    taskEitherExtensions.fromPromise(jira.postIssue(jiraFormat(postData, imageUrl))),
                    mapLeft(error => ServerError({error})),
                    map((response: object) => Ok(response))
                )))));
    }));

    router.get("/projects", _route(() => {
        return pipe(
            taskEitherExtensions.fromPromise(jira.listProjects()),
            mapLeft(error => ServerError({error})),
            map((response: object) => Ok(response))
        )
    }));

    router.get("/issuetypes", _route(() => {
        return pipe(
            taskEitherExtensions.fromPromise(jira.listIssueTypes()),
            mapLeft(error => ServerError({error})),
            map((response: object) => Ok(response))
        )
    }))
    return router;
}

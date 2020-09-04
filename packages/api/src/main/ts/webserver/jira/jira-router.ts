import {JiraConfig} from "../server";
import * as express from "express";
// @ts-ignore
import JiraApi from "jira-client";
import {_route} from "../routing/route";
import {pipe} from "fp-ts/lib/pipeable";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import {chain, map, mapLeft} from "fp-ts/TaskEither";
import {Ok, ServerError} from "../routing/responses";
import {
    JiraPoster$Post$Params,
    jiraPosterPostDecode
} from "@shotputter/common/src/main/ts/services/poster/jira/JiraPoster";
import {ioUtils} from "@shotputter/common/src/main/ts/util/io-utils";
import {BadDecodeResponse} from "../routing/response-errors";
import {ImageUploader} from "@shotputter/common/src/main/ts/services/images/uploader";
import {getRequest} from "@shotputter/common/src/main/ts/services/HostedRequester";

const jiraFormat = (postData: JiraPoster$Post$Params, imageUrl: string) => ({
    update: {},
    fields: {
        project: {
            id: postData.project
        },
        ...(postData.summary ? {summary: postData.summary} : {}),
        ...(postData.issuetype ? {
            issuetype: {
                id: postData.issuetype
            }
        } : {}),
        ...(postData.priorityId ? {
            priority: {
                id: postData.priorityId
            }
            } : {}),
        description: `
    !${imageUrl}!
    ${postData.message}
    `
    }
})

export const getJiraRouter = (jiraConfig: JiraConfig, imageUploader: ImageUploader) => {
    const router = express.Router();
    const jira = new JiraApi({
        protocol: 'https',
        username: jiraConfig.username,
        password: jiraConfig.password,
        host: jiraConfig.host
    });
    router.post("/post", _route(({req}) => {
        return pipe(
            ioUtils.toTaskEither(req.body, jiraPosterPostDecode, BadDecodeResponse),
            chain((postData) => pipe(
                imageUploader.uploadImage(postData.image),
                mapLeft(error => ServerError(error)),
                chain(imageUrl => {
                    return pipe(
                        taskEitherExtensions.fromPromise(
                            jira.addNewIssue(jiraFormat(postData, imageUrl))
                        ),
                        mapLeft(error => ServerError({error})),
                        map((response: object) => Ok(response))
                    )
                }))));
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
    }));

    router.get("/priorities", _route(() => {
        return pipe(
            taskEitherExtensions.fromPromise(jira.listPriorities()),
            mapLeft(error => ServerError({error})),
            map((response: object) => Ok(response))
        )
    }));

    router.get("/createmetadata", _route(() => {
        return pipe(
                getRequest(
                    `https://${jiraConfig.host}/rest/api/3/issue/createmeta?expand=projects.issuetypes.fields`,
                    {
                        Authorization: `Basic ${new Buffer(`${jiraConfig.username}:${jiraConfig.password}`).toString("base64")}`
                    }
                ),
            mapLeft(error => ServerError({error})),
            map((response: object) => Ok(response))
        )
    }))
    return router;
}

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
import {doPostRequest} from "@shotputter/common/src/main/ts/services/HostedRequester";

const jiraFormat = (postData: JiraPoster$Post$Params, imageUrl: string) => {
    const data =  {
        update: {},
        fields: {
            project: {
                id: postData.project
***REMOVED***
            summary: postData.summary,
                issuetype: {
                id: postData.issuetype
***REMOVED***
            "priority": {
                id: postData.priorityId
***REMOVED***
            description: `
        !${imageUrl}!
        ${postData.message}
        `
        }
    }
    console.log(data);
    return data;
}

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
                    console.log(JSON.stringify(jiraFormat(postData, imageUrl), null, 2))
                    return pipe(
                            doPostRequest(
                                `https://${jiraConfig.host}/rest/api/latest/issue`,
                                jiraFormat(postData, imageUrl),
                                {
                                    Authorization: `Basic ${new Buffer(`${jiraConfig.username}:${jiraConfig.password}`).toString("base64")}`
                    ***REMOVED***
                            ),
                        mapLeft(error => ServerError({error})),
                        chain(response => pipe(
                            taskEitherExtensions.fromPromise(
                                response.json()
                            ),
                            mapLeft(error => ServerError({error}))
                            )
                        ),
                        map((response: object) => Ok(response))
                    )
    ***REMOVED***))));
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
    return router;
}

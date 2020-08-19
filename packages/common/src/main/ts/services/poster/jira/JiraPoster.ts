
/**
 *    const fields = {
      project: {
        key: config.projectKey
      },
      summary: bug.summary,
      issuetype: {
        name: config.bugIssueName
      },
      priority: {
        id: priority
      },
      description: bug.description
    };
 */
import {HostedRequester, HttpError} from "../../HostedRequester";
import {TaskEither} from "fp-ts/lib/TaskEither";
import * as t from "io-ts";

export interface JiraPoster$Post$Params {
    project: string;
    priorityId: string;
    summary: string;
    issuetype: string;
    message: string;
    image: string;
}

export interface JiraProject {
    id: string;
    key: string;
    name: string;
    entityId: string;
    uuid: string;
}

export interface JiraIssueType {
    id: string;
    name: string;
    description: string;
}

export const jiraPosterPostDecode: t.Type<JiraPoster$Post$Params> = t.strict({
    project: t.string,
    priorityId: t.string,
    summary: t.string,
    message: t.string,
    issuetype: t.string,
    image: t.string
});

export interface JiraPoster {

    post({project, priorityId, summary, message, image}: JiraPoster$Post$Params): TaskEither<HttpError, true>;
    listProjects(): TaskEither<HttpError, JiraProject[]>;
    listIssueTypes(): TaskEither<HttpError, JiraIssueType[]>;

}

export const HostedJiraPoster = (requester: HostedRequester): JiraPoster => {
    return {
        post: (params: JiraPoster$Post$Params) => {
            return requester.post("/jira/post", params);
        },
        listProjects: () => {
            return requester.get("/jira/projects")
        },
        listIssueTypes: () => {
            return requester.get("/jira/issuetypes")
        }
    }
}

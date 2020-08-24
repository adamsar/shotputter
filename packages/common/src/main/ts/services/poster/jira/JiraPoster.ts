import {HostedRequester, HttpError} from "../../HostedRequester";
import {TaskEither} from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import {withRequired} from "../../../util/io-utils";

export interface JiraPoster$Post$Params {
    project: string;
    priorityId?: string;
    summary?: string;
    issuetype?: string;
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

export interface JiraPriority {
    id: string;
    name: string;
    description: string;
}

export interface JiraField {
    required: boolean;
    schema: {
        type: string;
        system: string;
    };
    hasDefaultValue: boolean;
    allowedValues: {
        id: string;
        name?: string;
    }[];
}

export interface JiraCreateMetadata {
    projects: (JiraProject & {
        issuetypes: (JiraIssueType & {fields: {[key: string]: JiraField}})[]
    })[]
}

export const jiraPosterPostDecode: t.Type<JiraPoster$Post$Params> = t.strict({
    project: withRequired(t.string),
    priorityId: t.union([t.undefined, t.null, t.string]),
    summary: t.union([t.undefined, t.null, t.string]),
    message: withRequired(t.string),
    issuetype: t.union([t.undefined, t.null, t.string]),
    image: withRequired(t.string)
});

export interface JiraPoster {

    post({project, priorityId, summary, message, image}: JiraPoster$Post$Params): TaskEither<HttpError, true>;
    listProjects(): TaskEither<HttpError, JiraProject[]>;
    listIssueTypes(): TaskEither<HttpError, JiraIssueType[]>;
    listPriorities(): TaskEither<HttpError, JiraPriority[]>;
    getCreateMetadata(): TaskEither<HttpError, JiraCreateMetadata>;

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
        },
        listPriorities: () => {
            return requester.get("/jira/priorities");
        },
        getCreateMetadata: () => {
            return requester.get("/jira/createmetadata");
        }
    }
}

import {Metadata} from "@shotputter/common/src/main/ts/models/Metadata";
import * as Handlebars from "handlebars";
import {chain, fromEither, TaskEither} from "fp-ts/TaskEither";
import {tryCatch} from "fp-ts/Either";
import {pipe} from "fp-ts/pipeable";

export type BrowserTemplate = string |  { templateKey: string; } | (() => string);

export const defaultUnformattedTemplate = `
{{#if image }}{{ image }}{{/if}}
{{#if message}}{{message}}{{/if}}
{{#if metadataString}}
Metadata:
--------------
{{{  metadataString }}}
{{/if}}

{{#if systemInfoString}}
System info
--------------
{{{  systemInfoString }}}
{{/if}}

{{#if logsString}}
Logs:
--------------
{{logsString}}
{{/if}}
`
// message, metadata, logs, image
export const defaultTemplate =  `
{{#if image }}{{ image }}{{/if}}
{{#if message }}{{ message }}{{/if}}
{{#if metadataString}}
Metadata:
--------------
\`\`\`
{{{  metadataString }}}
\`\`\`
{{/if}}
{{#if systemInfoString }}
System info:
--------------
\`\`\`
{{{  systemInfoString }}}
\`\`\`
{{/if}}
{{#if logsString}}
Logs:
--------------
\`\`\`
{{logsString}}
{{/if}}
\`\`\`
`;

export const defaultSlackTemplate = `
{{ message }}

{{#if metadataString}}
Metadata:
--------------
\`\`\`
{{{  metadataString }}}
\`\`\`
{{/if}}
{{#if systemInfoString}}
System info
--------------
\`\`\`
{{{  systemInfoString }}}
\`\`\`
{{/if}}
{{#if logsString}}
Logs:
--------------
\`\`\`
{{logsString}}
{{/if}}
\`\`\`
`;

export type SlackParams = {
    message: string;
    metadata: object;
    systemInfo: object;
    metadataString: string;
    systemInfoString: string;
    logs?: string[];
    logsString?: string;
}

export type ImageParams = SlackParams;

export type TitleParams = {};

export type TemplateParams = SlackParams | ImageParams | TitleParams;

export const applyTemplate = (template: BrowserTemplate, params?: TemplateParams): TaskEither<string, string> => {
    let handleBarsTemplate: TaskEither<string, HandlebarsTemplateDelegate<any>>;
    switch (typeof template) {
        case "string":
            handleBarsTemplate = fromEither(tryCatch(
                () => Handlebars.compile(template),
                (error:string) => error
            ));
            break;
        case "function":
            handleBarsTemplate = fromEither(tryCatch(
                () => Handlebars.compile(template()),
                (error:string) => error
            ));
            break;
    }
    return pipe(
        handleBarsTemplate,
        chain(_template => fromEither(tryCatch(() => _template(params ?? {}), (error: string) => error)))
    );
}


/*
const config: ShotputBrowserConfig = {
    service: {
        url: "http://localhost:3002",
        autoPost: true,
        autoPostFirst: true
    },
    /*slack: {
        enabled: true,
        autoPost: true,
        defaultChannel: "test-posts"
    },*//*
    captureLogs: true,
    github: {
        enabled: true,
        autoPost: true,
        defaultRepo: "shotputter",
        defaultOwner: "adamsar",
        defaultLabels: ["test"]
    }
}*/

export interface ShotputBrowserConfig {

    service: {
        url: string;
        messageTemplate?: BrowserTemplate;
        autoPost?: boolean;
        autoPostFirst?: boolean;
    } | false;

    metadata?: Metadata;

    captureLogs?: boolean;

    errorReporting?: {
        enabled: boolean;
        slack?: {
            enabled: boolean;
            channel: string;
            template?: BrowserTemplate;
        };
        google?: {
            enabled: boolean;
            template?: BrowserTemplate
        }
        customEndpoint?: string;
        consoleLog?: {
            enabled: boolean;
        }
        template?: BrowserTemplate;
    } ;

    download?: {
        enabled: boolean;
        template?: BrowserTemplate;
    };

    slack?: ({
        enabled: true;
        forceChannel?: boolean;
    } & ({slackTemplate?: string; defaultChannel: string; autoPost: true;} | {
        slackTemplate?: string;
        defaultChannel?: string;
        autoPost?: false;
    })) | {
        enabled?: false;
        forceChannel?: boolean;
        autoPost?: boolean
        defaultChannel?: string;
        slackTemplate?: string;
    };

    github?: ({
        enabled: true;
        forceRepo?: boolean;
        defaultLabels?: string[];
        titleTemplate?: BrowserTemplate;
    } & ({
        defaultOwner: string;
        defaultRepo: string;
        autoPost: boolean;
    } | { defaultLabels?: string[]; defaultOwner?: string; defaultRepo?: string; autoPost?: false})) | {
        enabled?: false;
        forceRepo?: boolean;
        titleTemplate?: BrowserTemplate;
        defaultOwner?: string;
        defaultRepo?: string;
        defaultLabels?: string[];
        autoPost?: boolean;
    };

    google?: ({
        enabled: boolean;
        template?: BrowserTemplate;
        autoPost?: boolean;
    });

    jira?: (({
        enabled: true;
        template?: BrowserTemplate;
        forceProject?: boolean;
        forceIssueType?: boolean;
    } & ({
        autoPost: true;
        defaultPriority?: string;
        defaultIssueType: string;
        defaultProject: string;
        defaultSummary?: string;
    } | {
        autoPost?: false;
        defaultIssueType?: string;
        defaultPriority?: string;
        defaultSummary?: string;
        defaultProject?: string;
    })) | {
        enabled: false;
        forceProject?: boolean;
        forceIssueType?: boolean;
        defaultSummary?: string;
        defaultPriority?: string;
        defaultIssueType?: string;
        defaultProject?: string;
        autoPost?: boolean;
        template?: BrowserTemplate;
    })

    custom?: ({
        enabled: true
        endpoint: string;
    } & ({autoPost: false; buttonText: string} | {autoPost: true})) | {
        enabled: false;
        endpoint?: string;
    }

}

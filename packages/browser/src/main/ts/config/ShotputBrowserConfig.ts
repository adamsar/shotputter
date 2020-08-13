import {Metadata} from "@shotputter/common/src/main/ts/models/Metadata";
import * as Handlebars from "handlebars";
import {chain, fromEither, TaskEither} from "fp-ts/TaskEither";
import {tryCatch} from "fp-ts/Either";
import {pipe} from "fp-ts/pipeable";

export type BrowserTemplate = string |  { templateKey: string; } | (() => string);

// message, metadata, logs, image
export const defaultTemplate =  `
{{ image }}
{{#if metadata}}
Metadata:
--------------
\`\`\`
{{  metadata }}
\`\`\`
{{/metadata}}
{{#if systemInfo}}
--------------
\`\`\`
{{  systemInfo }}
\`\`\`
{{/systemInfo}}
{{#if logs}}
--------------
Logs:
\`\`\`
{{logs}}
{{/if}}
\`\`\`
`;

export const defaultSlackTemplate = `
{{ message }}
{{#if metadata}}
Metadata:
--------------
\`\`\`
{{  metadata }}
\`\`\`
{{/metadata}}
{{#if systemInfo}}
--------------
\`\`\`
{{  systemInfo }}
\`\`\`
{{/systemInfo}}
{{#if logs}}
--------------
Logs:
\`\`\`
{{logs}}
{{/if}}
\`\`\`
`;

export type SlackParams = {
    message: string;
    metadata: string;
    systemInfo: string;
    logs?: string;
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

/*const config: ShotputBrowserConfig = {
    service: {
        url: "http://localhost:3002",
        autoPost: true
    },
    slack: {
        enabled: true,
        autoPost: true,
        defaultChannel: "test-posts"
    },
    captureLogs: true
}*/

export interface ShotputBrowserConfig {

    service: {
        url: string;
        messageTemplate?: BrowserTemplate;
        autoPost?: boolean;
    } | false;

    metadata?: Metadata;

    captureLogs?: boolean;

    errorReporting?: {
        enabled: boolean;
        slack?: {
            enabled: boolean;
            channel: string;
        };
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
    } & ({slackTemplate?: string; defaultChannel: string; autoPost: true;} | {
        slackTemplate?: string;
        defaultChannel?: string;
        autoPost?: false;
    })) | {
        enabled?: false;
        autoPost?: boolean
        defaultChannel?: string;
        slackTemplate?: string;
    };

    github?: ({
        enabled: true;
        defaultLabels?: string[];
        titleTemplate?: BrowserTemplate;
    } & ({
        defaultOwner: string;
        defaultRepo: string;
        autoPost: boolean;
    } | { defaultLabels?: string[]; defaultOwner?: string; defaultRepo?: string; autoPost?: false})) | {
        enabled?: false;
        titleTemplate?: BrowserTemplate;
        defaultOwner?: string;
        defaultRepo?: string;
        defaultLabels?: string[];
        autoPost?: boolean;
    }

    custom?: ({
        enabled: true
        endpoint: string;
    } & ({autoPost: false; buttonText: string} | {autoPost: true})) | {
        enabled: false;
        endpoint?: string;
    }

}

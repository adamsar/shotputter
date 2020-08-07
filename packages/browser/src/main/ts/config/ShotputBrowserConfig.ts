import {Metadata} from "@shotputter/common/src/main/ts/models/Metadata";

export type BrowserTemplate = string |  { templateKey: string; } | (() => string);

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
        customEndpoint?: string;
        consoleLog?: {
            enabled: boolean;
        }
    } ;

    download?: {
        enabled: boolean;
        template?: BrowserTemplate;
    };

    slack?: ({
        enabled: true;
    } & ({defaultChannel: string; autoPost: true;} | {
        defaultChannel?: string; autoPost?: false;
    })) | {
        enabled?: false;
        autoPost?: boolean
        defaultChannel?: string;
    };

    github?: ({
        enabled: true;
        titleTemplate?: BrowserTemplate;
    } & ({
        defaultOwner: string;
        defaultRepo: string;
        autoPost: boolean;
    } | { defaultOwner?: string; defaultRepo?: string; autoPost?: false})) | {
        enabled?: false;
        titleTemplate?: BrowserTemplate;
        defaultOwner?: string;
        defaultRepo?: string;
        autoPost?: boolean
    }

    custom?: ({
        enabled: true
        endpoint: string;
    } & ({autoPost: false; buttonText: string} | {autoPost: true})) | {
        enabled: false;
        endpoint?: string;
    }

}

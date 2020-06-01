import {SystemInfo} from "@shotputter/common/src/main/ts/models/SystemInfo";

export const getSystemInfo = (window: Window): SystemInfo => {
    return {
        navigatorInfo: {
            appName: window.navigator.appName,
            appVersion: window.navigator.appVersion,
            languages: window.navigator.languages,
            language: window.navigator.language,
            platform: window.navigator.platform,
            userAgent: window.navigator.userAgent
        },
        referrer: window.document?.referrer,
        url: window.location.href + window.location.search,
        localStorage: window.localStorage,
        windowSize: {
            x: window.innerWidth,
            y: window.innerHeight
        },
        sessionStorage: window.sessionStorage
    };
};

export const codeBlockString = (text: string) => `\`\`\`${text}\`\`\``

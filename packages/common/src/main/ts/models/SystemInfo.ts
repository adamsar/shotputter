export interface SystemInfo {

    navigatorInfo?: object;
    referrer?: string;
    url: string;
    localStorage?: object;
    windowSize: {
        x: number;
        y: number;
    };
    sessionStorage?: object;

}

declare module "html2canvas" {

    interface HTML2CanvasOptions {
        allowTaint?: boolean;
        backgroundColor?: string;
        canvas?: HTMLCanvasElement;
        foreignObjectRendering?: boolean;
        imageTimeout?: number;
        ignoreElements?: (element: HTMLElement) => boolean;
        logging?: boolean;
        onclone?: () => void;
        proxy?: string; // URL
        removeContainer?: boolean;
        scale?: number;
        useCORS?: boolean;
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        scrollX?: number;
        scrollY?: number;
        windowWidth?: number;
        windowHeight?: number;

    }

    function html2canvas(element: HTMLElement, options?: HTML2CanvasOptions = {}): Promise<HTMLCanvasElement>;

    export default html2canvas;

}
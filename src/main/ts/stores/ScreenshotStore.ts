import {observable} from "mobx";
import html2canvas from "html2canvas";
import {MAIN_ID} from "../constants";

export class ScreenshotStore {

    @observable screenshotCanvas: HTMLCanvasElement | null = null;

    async takeScreenshot() {
        const canvas = await html2canvas(document.body, {
           ignoreElements: element => element.id === MAIN_ID
        });
        this.screenshotCanvas = canvas;
    }

}
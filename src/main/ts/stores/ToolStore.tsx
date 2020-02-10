import {observable} from "mobx";

type CurrentTool = null | "draw" | "shape" | "text" | "arrow";

export const colors: string[] = [
    "#FFFFFF",
    "#DF151A",
    "#FD8603",
    "#F4F328",
    "#00DA3C",
    "#00CBE7",
    "#000000"
];

export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FONT_SIZE = 16;

export class ToolStore {

    @observable currentTool: CurrentTool = null;
    @observable color: string = colors[1];
    @observable strokeWidth: number = DEFAULT_STROKE_WIDTH;
    @observable isFill: boolean = false;
    @observable fontSize: number = DEFAULT_FONT_SIZE;
    @observable isBold: boolean = false;

    setStrokeWidth(modifier?: number) {
        this.strokeWidth = modifier ? Math.max(Math.min(this.strokeWidth + modifier, 10), 1) : DEFAULT_STROKE_WIDTH;
    }

    setFontSize(modifier?: number) {
        this.fontSize = modifier ? Math.max(Math.min(this.fontSize + modifier, 36), 12) : DEFAULT_FONT_SIZE;
    }

}
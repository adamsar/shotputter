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

export class ToolStore {

    @observable currentTool: CurrentTool = null;
    @observable color: string = colors[1];

}
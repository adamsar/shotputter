import {observable} from "mobx";

type CurrentTool = null | "draw" | "shape" | "text";

export class ToolStore {

    @observable currentTool: CurrentTool = null;


}
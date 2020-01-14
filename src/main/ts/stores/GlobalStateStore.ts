import {computed, observable} from "mobx";

interface WindowSize {
    width: number;
    height: number;
}

const computeWindowSize = (): WindowSize => {
    const w=window;
    const d=document;
    const e=d.documentElement;
    const g=d.getElementsByTagName('body')[0];
    const width=w.innerWidth||e.clientWidth||g.clientWidth;
    const height =w.innerHeight||e.clientHeight||g.clientHeight;

    return { width, height }
}

export class GlobalStateStore {

    constructor() {
        window.addEventListener("resize", () => {
            this.windowSize = computeWindowSize();
        })
    }

    @observable.struct windowSize: WindowSize =     computeWindowSize();

    @computed get isMobile(): boolean { return this.windowSize.width < 768 }

}
import {SystemInfo} from "../../models/SystemInfo";

export interface Post {
    image: string; // Base 64;
    message: string | null;
    systemInfo?: SystemInfo;
}

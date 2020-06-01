import {SystemInfo} from "../../models/SystemInfo";
import {Metadata} from "../../models/Metadata";

export interface Post {

    image: string; // Base 64;
    message: string | null;
    systemInfo?: SystemInfo;
    metadata?: Metadata;

}

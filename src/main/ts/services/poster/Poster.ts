import {Post} from "./Post";
import {PostResult} from "./PostResult";

export type PosterType = "download";

export interface Poster {

    typeName: PosterType;
    send(post: Post): Promise<PostResult>;

}
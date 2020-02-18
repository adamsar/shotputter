import {Post} from "./Post";
import {PostResult} from "./PostResult";

export type PosterType = "download" | "slack" | "github";

export interface Poster {

    typeName: PosterType;

    send(post: Post): Promise<PostResult>;

}
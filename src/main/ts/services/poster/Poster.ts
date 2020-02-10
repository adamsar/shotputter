import {Post} from "./Post";
import {PostResult} from "./PostResult";

export interface Poster {
    
    send(post: Post): Promise<PostResult>;

}
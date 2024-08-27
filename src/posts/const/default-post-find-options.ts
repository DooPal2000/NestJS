import { FindManyOptions } from "typeorm";
import { PostsModel } from "../entity/posts.entity";


export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {
    relations : {
        // 보통 배열방식을 쓰는데, 이런 식으로 객체로도 만들 수 있다. 
        author: true,
        images: true,
    }
}
import { IsOptional, IsString } from "class-validator";
import { PostsModel } from "../entities/posts.entity";
import { PickType } from "@nestjs/mapped-types";

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
    @IsString()
    @IsOptional()
    image?: string;
}

// Pick은 type을 입력해야 하는데, 여기엔 type 이 아닌 value(값)이 들어가있다?
// 그래서 Pick 과 같은 기능을 해주는데, 값을 반환해주는 기능을 만들어뒀다.

// Pick, Omit, Partial -> 타입반환
// PickType, OmitType, ParitalType -> 값 반환(extends 가능)
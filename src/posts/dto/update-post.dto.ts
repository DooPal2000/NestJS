import { PartialType, PickType } from "@nestjs/mapped-types";
import { PostsModel } from "../entities/posts.entity";
import { CreatePostDto } from "./create-post.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdatePostDto extends PartialType(CreatePostDto) {
    // 문맥적 파악 용이, PartialType을 지워도, 현재 프로젝트상에는 문제가 없다.
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;
}


// Pick은 type을 입력해야 하는데, 여기엔 값이 들어가있다?
// 그래서 Pick 과 같은 기능을 해주는데, 값을 반환해주는 기능을 만들어뒀다.

// Pick, Omit, Partial -> 타입반환
// PickType, OmitType, ParitalType -> 값 반환(extends 가능)
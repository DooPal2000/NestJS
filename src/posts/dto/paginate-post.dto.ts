import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

export class PaginatePostDto extends BasePaginationDto{

    // 아래 6줄이 주석처리되었을 시, 이 속성으로 접근 불가능하도록 main.ts에 whitelist를 true 로 세팅합니다.
    // ++ 추가로, forbidNonWhitelisted : true 로도 설정합니다 (단순 스트리핑이 아니고, )

    @IsNumber()
    @IsOptional()
    where__likeCount__more_than: number;

    @IsString()
    @IsOptional()
    where__title__i_like: string;



    // 앞으로는, 상속을 통해 DTO를 구현하도록 합니다
    
    // @IsNumber()
    // @IsOptional()
    // page?: number;

    // // 이전 마지막 데이터의 ID
    // // 이 프로퍼티에 입력된 ID보다 높은 ID부터 값을 가져오기
    // @IsNumber()
    // @IsOptional()
    // where__id_less_than?: number;

    // @IsNumber()
    // @IsOptional()
    // where__id_more_than?: number;

    // // 정렬 
    // // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
    // @IsIn(['ASC', 'DESC'])
    // @IsOptional()
    // order__createdAt?: 'ASC' | 'DESC' = 'ASC';

    // // 몇 개의 데이터를 응답으로 받을 건인지에 대해
    // @IsNumber()
    // @IsOptional()
    // take: number = 20;
}
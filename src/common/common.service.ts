import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BaseModel } from './entity/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';

@Injectable()
export class CommonService {
    paginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {
        if (dto.page) {
            this.pagePaginate(
                dto,
                repository,
                overrideFindOptions
            )
        } else {
            return this.cursorPaginate(
                dto,
                repository,
                overrideFindOptions,
                path,
            )
        }

    }

    private async pagePaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
    ) {

    }
    private async cursorPaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {
        /**
         * where__likeCount__more_than
         * 
         * where__title__ilike 
         */

    }

    private composeFindOptions<T extends BaseModel>(
        dto: BasePaginationDto,
    ): FindManyOptions<T> {
        /**
         * where,
         * order,
         * take,
         * skip -> page 기반일때만
         */

        /**
         * DTO 의 현재 생긴 구조는 아래와 같음
         * {
         *  where__id__more_than : 1 
         *  order__createdAt : 'ASC'
         * }
         * 
         * 현재는 where__id__more_than / where__id__less_than 에 해당하는 where 필터 사용중이지만
         * 나중에 where__likeCount__more_than 이나 where__title__ilike 등 추가 필터를 넣고싶을때
         * 모든 where 필터들을 자동으로 파싱 할 수 있을만한 기능을 제공한다.
         * 
         * 1) where로 시작한다면 필터 로직을 적용한다.
         * 2) order로 시작한다면 정렬 로직을 적용한다.
         * 3) 필터 로직을 적용한다면 '__' 기준으로 split 했을 때 split 했을 때 3개의 값으로 나뉘는지
         *  2개의 값으로 나뉘는지 확인한다.
         *  3-1) 3개의 값으로 나뉜다면, FILTER_MAPPER에서 해당되는 operator  함수를 찾아서 적용한다.
         *  3-2) 2개의 값으로 나뉜다면, 정확한 값을 필터하는 것이기 때문에 operator 없이 적용한다.
         * 4) order 의 경우, 3-2와 같이 적용한다.
         */
        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};

        for (const [key, value] of Object.entries(dto)) {


            if (key.startsWith('where__')) {
                where = {
                    ...where,
                    ...this.parseWhereFilter(key, value),
                }
            } else if (key.startsWith('order__')) {
                order = {
                    ...order,
                    ...this.parseOrderFilter(key, value),
                }
            }
        }

        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : null,
        };
    }
    private parseWhereFilter<T extends BaseModel>(key: string, value: any):
        FindOptionsWhere<T> {
        const options: FindOptionsWhere<T> = {};
        const split = key.split('__');
        if (split.length !== 2 && split.length !== 3) {
            throw new BadRequestException();
            `where 필터는 '__'로 split 했을때 길이가 2 or 3 이어야 합니다. 문제되는 키값 : ${key}`
        }
        if (split.length === 2) {
            // [where, id]
            const [_, field] = split;
            /**
             * 이 경우는 where__id
             * field -> 'id'
             * value -> 3
            */
            options[field] = value;
        } else {
            /**
             * 길이가 3일 경우에는 where__id__more_than 호은 less_than
             * where 버리고, 두번째 값은 필터할 키값,
             * 세번째 값은 typeorm 유틸리티가 된다.
             * 
             * FILTER_MAPPER에 미리 정의해둔 값들로
             * field 값에 FILTER_MAPPER에서 해당되는 utility를 가져온 후 값에 적용
            */

            // ['where','id','more_than']
            const [_, field, operator] = split;

            // where__id_between = 3,4
            // 만약에 split 대상 문자가 존재하지 않으면 길이가 무조건 1
            // const values = value.toString().split(',')

            // field -> id
            // operator -> more_than
            // FILTER_MAPPER[operator] -> MoreThan

            // if(operator ==='between'){
            //     options[field] = FILTER_MAPPER[operator](value[0], value[1]);
            // }else{
            //     options[field] = FILTER_MAPPER[operator](value);
            // }

            options[field] = FILTER_MAPPER[operator](value);

        }
        return options;
    }
    private parseOrderFilter<T extends BaseModel>(key: string, value: any):
        FindOptionsOrder<T> {
        const order: FindOptionsOrder<T> = {};
        // order 는 무조건 2개로 스플릿된다.
        const split = key.split('__');

        if (split.length !== 2) {
            throw new BadRequestException(
                `order 필터는 '__'로 split 했을 때 길이가 2여야 합니다. -문제되는 키값: ${key}`,
            )
        }

        const [_, field] = split;
        order[field] = value; // 이게 속성 추가 로직이다 order { filed : value }

        return order;
    }
}

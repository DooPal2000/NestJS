import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, QueryRunner, Repository } from 'typeorm';
import { PostsModel } from './entity/posts.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { count } from 'console';
import { CommonService } from 'src/common/common.service';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env-keys.const';
import { POST_IMAGE_PATH, PUBLIC_FOLDER_NAME, PUBLIC_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { basename, join } from 'path';
import { promises } from 'fs';
import { CreatePostImageDto } from './image/dto/create-image.dto';
import { ImageModel } from 'src/common/entity/image.entity';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options';



@Injectable() // 이 어노테이션 외에도 module.ts 에도 등록해야 합니다. 2가지가 되어야 DI 완료
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
        @InjectRepository(ImageModel)
        private readonly imageRepository: Repository<ImageModel>,
        private readonly commonService: CommonService,
        private readonly configService: ConfigService,
    ) { }

    async getAllPosts() {
        return await this.postsRepository.find({
            ...DEFAULT_POST_FIND_OPTIONS
        });
    }

    async generatePosts(userId: number) {
        for (let i = 0; i < 100; i++) {
            await this.createPost(userId, {
                title: `임의로 생성된 포스트 ${i}`,
                content: `임의로 생성된 포스트내용 ${i}`,
                images: []
            });
        }
    }

    async paginatePosts(dto: PaginatePostDto) {
        // if (dto.page) {
        //     return this.pagePaginatePosts(dto);
        // } else {
        //     return this.cursorPaginatePosts(dto);
        // }

        // console.log('paginatePosts dto:', dto);

        return await this.commonService.paginate(
            dto,
            this.postsRepository,
            {
                ...DEFAULT_POST_FIND_OPTIONS,
            },
            'posts'
        );
    }
    async pagePaginatePosts(dto: PaginatePostDto) {
        /**
         *  더이상 사용하지 않음 (202407월말)
         * data : Data[],
         * total: number,
         * next: ??
         * 
         * [1] [2] [3] [4]
         */
        dto.page;
        const [posts, count] = await this.postsRepository.findAndCount({
            skip: dto.take * (dto.page - 1),
            take: dto.take,
            order: {
                createdAt: dto.order__createdAt,
            }
        });

        return {
            data: posts,
            total: count
        }
    }


    async cursorPaginatePosts(dto: PaginatePostDto) {
        // 더이상 사용하지 않음 (202407월말)
        const where: FindOptionsWhere<PostsModel> = {};
        if (dto.where__id__less_than) {
            where.id = LessThan(dto.where__id__less_than);
        } else if (dto.where__id__more_than) {
            where.id = MoreThan(dto.where__id__more_than);
        }

        const posts = await this.postsRepository.find({
            where,
            // order__createdAt
            order: {
                createdAt: dto.order__createdAt,
            },
            take: dto.take,
        });

        // 해당되는 Post 가 0개 이상이면 
        // 마지막 포스트를 가져오고
        // 아니면 null 반환
        const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
        const host = this.configService.get<string>(ENV_HOST_KEY);

        const lastItem = posts.length > 0 && posts.length === dto.take ? posts[posts.length - 1] : null;
        const nextUrl = lastItem && new URL(`${protocol}://${host}/posts`);
        if (nextUrl) {
            /**
             * dto의 키값들을 루핑하면서
             * 키값에 해당되는 벨류가 존재하면
             * param에 그대로 붙여넣는다.
             * 
             * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
             */
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
                        nextUrl.searchParams.append(key, dto[key]);
                    }
                }
            }
            let key = null;
            if (dto.order__createdAt === 'ASC') {
                key = 'where__id_more_than';
            } else {
                key = 'where__id_less_than';
            }
            nextUrl.searchParams.append(key, lastItem.id.toString())
        }
        /**
         * Response
         * 
         * data: Data[],
         * cursor: {
         *      after:마지막 data의 id값
         * },
         * count: 응답한 데이터의 갯수
         * next: 다음 요청을 할때 사용할 URL
         */
        return {
            data: posts,
            cursor: {
                after: lastItem?.id ?? null,
            },
            count: posts.length,
            next: nextUrl?.toString() ?? null,
        }
    }


    async getPostById(id: number, qr?: QueryRunner) {
        const repository = this.getRepository(qr);

        const post = await repository.findOne({
            ...DEFAULT_POST_FIND_OPTIONS,
            where: {
                id,
            },
        });
        if (!post) {
            throw new NotFoundException();
        }

        return post;
    }

    async createPostImage(dto: CreatePostImageDto) {
    }


    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<PostsModel>(PostsModel) : this.postsRepository;
    }
    async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
        // 1. create -> 저장될 객체를 생성한다
        // 2. save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
        const repository = this.getRepository(qr);
        const post = repository.create({
            author: {
                id: authorId
            },
            ...postDto,
            likeCount: 0,
            commentCount: 0,
            images: [],
            // dto.images,
        });

        const newPost = await repository.save(post);

        return newPost;
    }

    async updatePost(postId: number, postDto: UpdatePostDto) {
        const { title, content } = postDto;
        // save 의 기능
        // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
        // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.
        const post = await this.postsRepository.findOne({
            where: {
                id: postId,
            },
        });
        if (!post) {
            throw new NotFoundException();
        }
        if (title) {
            post.title = title;
        }
        if (content) {
            post.content = content;
        }
        const newPost = await this.postsRepository.save(post);

        return newPost;
    }

    async deletePost(postId: number) {
        const post = await this.postsRepository.findOne({
            where: {
                id: postId,
            }
        });
        if (!post) {
            throw new NotFoundException();
        }
        await this.postsRepository.delete(postId);
        return postId;
    }
}

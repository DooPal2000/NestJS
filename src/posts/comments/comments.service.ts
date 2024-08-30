import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PaginateCommentsDto } from './dto/paginate-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UsersModel } from 'src/users/entity/users.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsModel)
        private readonly commentsRepository: Repository<CommentsModel>,
        private readonly commonService: CommonService
    ) { }

    paginateComments(
        dto: PaginateCommentsDto,
        postId: number,
    ) {
        return this.commonService.paginate(
            dto,
            this.commentsRepository,
            {
                where: {
                    post: {
                        id: postId,
                    }
                }
            },
            `posts/${postId}/comments`
        );
    }

    async getCommentById(id: number) {
        const comment = await this.commentsRepository.findOne({
            where: {
                id,
            }
        })
        if (!comment) {
            throw new BadRequestException(
                `id: ${id} Comment 는 존재하지 않습니다.`
            )
        }
        return comment;
    }

    async createComment(
        dto: CreateCommentsDto,
        postId: number,
        author: UsersModel,
    ){

    }
}

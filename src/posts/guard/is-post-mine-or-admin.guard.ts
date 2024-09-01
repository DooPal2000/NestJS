import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesEnum } from "src/users/const/roles.const";
import { PostsService } from "../posts.service";
import { Request } from "express";
import { UsersModel } from "src/users/entity/users.entity";

@Injectable()
export class IsPostMineOrAdmin implements CanActivate {
    constructor(
        private readonly postsService: PostsService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request & { user: UsersModel };

        const { user } = req;

        if (!user) {
            throw new UnauthorizedException(
                `사용자 정보를 가져올 수 없습니다.`)
        }

        if (user.role === RolesEnum.ADMIN) {
            return true;
        }

        const postId = req.params.postId;

        if (!postId) {
            throw new BadRequestException(
                `Post ID가 파라미터로 제공돼야합니다.`
            )
        }

        return this.postsService.isPostMine(
            user.id,
            parseInt(postId)
        )
    }
}
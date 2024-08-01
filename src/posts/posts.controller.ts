import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource } from 'typeorm';
import { PostsImagesService } from './image/images.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';

/**
* author :string;
* title: string;
* content: string;
* likeCount: number;
* commentCount: number;
*/


@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postsImagesService: PostsImagesService,

  ) { }

  @Get()
  @UseInterceptors(LogInterceptor)
  getPosts(
    @Query() query: PaginatePostDto,
  ) {
    return this.postsService.paginatePosts(query);
  }


  // POST /posts/random
  // @Post('random')
  // @UseGuards(AccessTokenGuard)
  // async postPostsRandom(@User() user: UsersModel){
  //   await this.postsService.generatePosts(user.id);

  //   return true;
  // }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) { // param 데코레이터에 파라미터 이름이 id이다. 
    return this.postsService.getPostById(id);
  }

  /**
   * DTO 추가, 240707
   * 트랜잭션 이론, 20240731
   * start, commit, rollback
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  async postPosts(
    // @Request() req:any,
    @User('id') userId: number,
    @Body() body: CreatePostDto,
  ) {
    // 트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너 생성
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    // 쿼리 러너에서 트랜잭션을 시작한다.
    // 이 시점부터 같은 쿼리 러너를 사용하면
    // 트랜잭션 안에서 데이터베이스 액션을 실행할 수 있다.
    await qr.startTransaction();

    //로직 실행
    try{
      const post = await this.postsService.createPost(
        userId, body, qr
      );
  
      for (let i = 0; i < body.images.length; i++) {
        await this.postsImagesService.createPostImage({
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        }, qr);
      }
  
      await qr.commitTransaction();
      return this.postsService.getPostById(post.id);

    }catch(e){
      // 어떤 에러가 발생하든, 트랜잭션 종료 후 롤백
      await qr.rollbackTransaction();
      await qr.release();
    }
  }

  @Patch(':id') // ? 를 붙임으로써 선택사항으로 남길 수 있다(null 허용)
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    // @Body('title') title?: string,
    // @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(
      id, body,
    );
  }

  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postsService.deletePost(+id);
  }
}

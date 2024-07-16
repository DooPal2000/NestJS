import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

/**
* author :string;
* title: string;
* content: string;
* likeCount: number;
* commentCount: number;
*/


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  getPosts(
    @Query() query: PaginatePostDto,
  ) {
    return this.postsService.paginatePosts(query);
  }
 // POST /posts/random
  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel){
    await this.postsService.generatePosts(user.id);
    
    return true;
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) { // param 데코레이터에 파라미터 이름이 id이다. 
    return this.postsService.getPostById(+id);
  }


  // DTO 추가, 240707
  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    // @Request() req:any,
    @User('id') userId: number,
    @Body() body: CreatePostDto,
  ) {
    return this.postsService.createPost(
      userId, body,
    );
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

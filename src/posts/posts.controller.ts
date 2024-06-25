import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';

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
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // 
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) { // param 데코레이터에 파라미터 이름이 id이다. 
    return this.postsService.getPostById(+id);
  }



  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(
      authorId, title, content
    );
  }

  @Put(':id') // ? 를 붙임으로써 선택사항으로 남길 수 있다(null 허용)
  putPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(
      id, title, content
    );
  }

  @Delete(':id')
  deletePost(
    @Param('id',ParseIntPipe) id: number,
  ) {
    return this.postsService.deletePost(+id);
  }
}

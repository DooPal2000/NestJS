import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
* author :string;
* title: string;
* content: string;
* likeCount: number;
* commentCount: number;
*/

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts : PostModel[] = [
  {
    id: 1,
    author: 'against_the_current',
    title: 'atc',
    content: '공연 준비 중인 atc',
    likeCount: 10000,
    commentCount: 99999
  },
  {
    id: 2,
    author: 'against_the_current',
    title: 'chrissy',
    content: '공연 준비 중인 chrissy',
    likeCount: 10000,
    commentCount: 99999
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '로제',
    content: '공연 준비 중인 로제',
    likeCount: 10000,
    commentCount: 99999
  }
]

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  getPosts(){
    return posts;
  }
  
  // 
  @Get(':id')
  getPost(@Param('id') id: string){ // 파람 데코레이터에 파라미터 이름이 id이다. 
    return posts.find((post)=> post.id == +id); // +함으로써 숫자 전환
  }




}

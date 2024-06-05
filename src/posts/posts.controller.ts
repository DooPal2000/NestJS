import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
* author :string;
* title: string;
* content: string;
* likeCount: number;
* commentCount: number;
*/

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  getPost(): Post {
    return{
      author: 'against_the_current',
      title: 'About ATC band',
      content: '공연 일정이 잡힌 ATC',
      likeCount: 1000000,
      commentCount: 99999
    };
  }

}

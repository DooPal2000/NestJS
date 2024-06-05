import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
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

let posts: PostModel[] = [
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
  getPosts() {
    return posts;
  }

  // 
  @Get(':id')
  getPost(@Param('id') id: string) { // 파람 데코레이터에 파라미터 이름이 id이다. 
    const post = posts.find((post) => post.id == +id); // +함으로써 숫자 전환

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0
    };

    posts = [
      ...posts,
      post,
    ]
    return post;
  }
}

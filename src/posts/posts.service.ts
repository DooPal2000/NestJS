import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/posts.entity';

// export interface PostModel {
//     id: number;
//     author: string;
//     title: string;
//     content: string;
//     likeCount: number;
//     commentCount: number;
// }

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


@Injectable() // 이 어노테이션 외에도 module.ts 에도 등록해야 합니다. 2가지가 되어야 DI 완료
export class PostsService {
    constructor(
        @InjectRepository(PostModel)
        private readonly postsRepository: Repository<PostModel>
    ){}
    async getAllPosts() {
        return await this.postsRepository.find();
    }

    async getPostById(id: number) {
        const post =  await this.postsRepository.findOne({
            where:{
                id,
            },
        });
        if (!post) {
            throw new NotFoundException();
        }

        return post;
    }

    async createPost(author: string, title: string, content: string) {
        // 1. create -> 저장될 객체를 생성한다
        // 2. save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)

        const post = this.postsRepository.create({
            author,
            title,
            content,
            likeCount: 0,
            commentCount: 0            
        });

        const newPost = await this.postsRepository.save(post);

        return newPost;
    }

    updatePost(postId: number, author: string, title: string, content: string) {
        const post = posts.find(post => post.id === postId);
        if (!post) {
            throw new NotFoundException();
        }
        if (author) {
            post.author = author;
        }
        if (title) {
            post.title = title;
        }
        if (content) {
            post.content = content;
        }

        posts = posts.map(prevPost => prevPost.id === postId ? post : prevPost);

        return post;
    }

    deletePost(postId: number) {
        const post = posts.find((post) => post.id === postId);
        if (!post) {
            throw new NotFoundException();
        }
        posts = posts.filter(post => post.id !== postId);

        return postId;
    }
}

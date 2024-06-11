import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/posts.entity';



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

    async updatePost(postId: number, author: string, title: string, content: string) {
        // save 의 기능
        // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
        // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.
        const post = await this.postsRepository.findOne({
           where:{
            id: postId,
           }, 
        });
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
        const newPost = await this.postsRepository.save(post);

        return newPost;
    }

    async deletePost(postId: number) {
        const post = await this.postsRepository.findOne({
            where:{
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

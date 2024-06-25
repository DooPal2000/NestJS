import { UsersModel } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PostsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> UsersModel, (user)=> user.posts, {
        nullable: false
    })
    author: UsersModel;
    

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;
    
    @UpdateDateColumn()
    updateAt: Date; 

    @CreateDateColumn()
    createdAt: Date;

}
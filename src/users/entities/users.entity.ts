import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length } from "class-validator";

@Entity()
export class UsersModel extends BaseModel {

    @Column({
        length: 20,
        unique: true,
    })
    @IsString()
    @Length(1, 20, {
        message: '닉네임은 1~20자 사이로 입력해주세요.'
    })
    nickname: string;

    @Column({
        unique: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    @Length(3, 8)
    password: string;

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER,
    })
    role: RolesEnum;

    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[];

}
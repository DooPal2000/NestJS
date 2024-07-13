import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";

@Entity()
export class UsersModel extends BaseModel {

    @Column({
        length: 20,
        unique: true,
    })
    @IsString({
        message: stringValidationMessage,
    })
    @Length(1, 20, {
        message: lengthValidationMessage,
    })
    nickname: string;

    @Column({
        unique: true,
    })
    @IsString({
        message: stringValidationMessage,
    })
    @IsEmail({}, {
        message: emailValidationMessage,
    })
    email: string;

    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    @Length(3, 8, {
        message: lengthValidationMessage,
    })
    password: string;

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER,
    })
    role: RolesEnum;

    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[];

}
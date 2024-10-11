import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UserFollowersModel } from './entity/user-followers.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        @InjectRepository(UserFollowersModel)
        private readonly userFollowersRepository: Repository<UserFollowersModel>,
    ) { }

    async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
        // 1) nickname 중복이 없는지 확인
        // 2) exist() -> 조건에 해당하는 값 있으면 true 반환

        const nicknameExists = await this.usersRepository.exists({
            where: {
                nickname: user.nickname,
            }
        })
        if (nicknameExists) {
            throw new BadRequestException('이미 존재하는 닉네임입니다.');
        }

        const emailExists = await this.usersRepository.exists({
            where: {
                email: user.email,
            }
        })
        if (emailExists) {
            throw new BadRequestException('이미 가입한 이메일입니다.');
        }

        const userObject = this.usersRepository.create({
            nickname: user.nickname,
            email: user.email,
            password: user.password,
        });

        const newUser = await this.usersRepository.save(userObject);

        return newUser;
    }

    async getAllUsers() {
        return this.usersRepository.find({});
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
            }
        })
    }

    async followUser(followerId: number, followeeId: number) {

        const result = await this.userFollowersRepository.save({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            }
        });

        return true;


        // const user = await this.usersRepository.findOne({
        //     where: {
        //         id: followerId
        //     },
        //     relations: {
        //         followees: true,
        //     },
        // });

        // if (!user) {
        //     throw new BadRequestException(
        //         `존재하지 않는 팔로워입니다.`
        //     );
        // }

        // await this.usersRepository.save({
        //     ...user,
        //     followees: [
        //         ...user.followees,
        //         {
        //             id: followeeId,
        //         }
        //     ]
        // })
    }

    async getFollowers(userId: number): Promise<UsersModel[]> {
        const result = await this.userFollowersRepository.find({
            where: {
                followee: {
                    id: userId,
                }
            },
            relations: {
                follower: true,
                followee: true,
            }
        })

        // const user = await this.usersRepository.findOne({
        //     where: {
        //         id: userId,
        //     },
        //     relations: {
        //         followers: true,
        //     }
        // });

        return result.map((x) => x.follower);
    }
}

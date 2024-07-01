import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }
    /**
     * 
     * 우리가 만드려는 기능
     * 
     * 1) registerWithEmail
     *  - email, nickname, password 입력받고 사용자 생성
     *  - 생성이 완료되면 accessToken과 refreshToken 반환한다.
     *  - 회원가입 후 다시 로그인해주세요 < 이 과정 방지
     * 
     * 2) loginWithEmail
     *  - email, password를 입력하면 사용자 검증을 진행한다.
     *  - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
     * 
     * 3) loginUser
     *  - 1)과 2) 에서 필요한 accessToken 과 refreshToken 반환하는 로직
     * 
     * 4) signToken
     *  - 3)에서 필요한 accessToken과 refreshToken을 sign 하는 로직
     * 
     * 5) authenticateWithEmailandPassword
     *  - 2) 에서 로그인을 진행할 때 필요한 기본적인 검증 진행
     *      1. 사용자 존재하는지 확인
     *      2. 비밀번호 맞는지 확인
     *      3. 모두 통과되면 찾은 사용자 정보 반환
     *      4. loginWithEmail 에서 반환된 데이터를 기반으로 토큰 생성
     */

    /**
     * Payload 에 들어갈 정보
     * 1) email
     * 2) sub -> id
     * 3) type: 'access'| 'refresh'
     *  
     */
    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
        // 여기에 UsersModel 은 비추합니다.
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        };

        return this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            // seconds
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }
    loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        }
    }

    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
        /**
        *     1. 사용자 존재하는지 확인
        *     2. 비밀번호 맞는지 확인
        *     3. 모두 통과되면 찾은 사용자 정보 반환
        */

        const existingUser = await this.usersService.getUserByEmail(user.email);
        
        if(!existingUser){
            throw new UnauthorizedException('존재하지 않는 사용자입니다.');
        }
        
        /**
         * 파라미터
         * 
         * 1) 입력된 비밀번호
         * 2)기존 해시 -> 사용자 정보에 저장돼있는 hash
         */
        const passOk = await bcrypt.compare(user.password, existingUser.password);

        if(!passOk){
            throw new UnauthorizedException('비밀번호가 틀렸습니다.');
        }
        return existingUser;


    }

}

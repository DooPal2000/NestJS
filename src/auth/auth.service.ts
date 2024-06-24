import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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

    

}

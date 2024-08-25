import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SocketBearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // socket에 사용자 정보 저장하기, 챕터 이후 아래 코드는 사용하지 않음, gateway로 이전
        const socket = context.switchToWs().getClient();

        const headers = socket.handshake.headers;

        const rawToken = headers['authorization'];

        if (!rawToken) {
            throw new WsException('토큰이 없습니다.');
        }

        try {
            const token = this.authService.extractTokenFromHeader(
                rawToken,
                true,
            );

            const payload = this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(payload.email);

            // RestApi 였으면  req 에 담을 텐데, 현재는 ws 이기에 소켓에 담는다
            socket.user = user;
            socket.token = token;
            socket.tokenType = payload.tokenType;

            return true;
        } catch (e) {
            throw new WsException('토큰이 유효하지 않습니다.');
        }

    }

}
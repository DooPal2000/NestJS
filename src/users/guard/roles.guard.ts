import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        /**
         * Roles annotationo 에 대한 metadata 를 가져와야 한다.
         * 
         * Reflector 
         * getAllAndOverride() => 함수에 가장 가까이 붙어 있는 @ 가져온다.         * 
         */

        const requiredRole = this.reflector.getAllAndOverride(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if(!requiredRole){
            return true;
        }

        const {user} = context.switchToHttp().getRequest();
        if(!user){
            throw new UnauthorizedException(
                `토큰을 제공해주세요.`
            )
            // 가드는 적용하는 순서가 매우 중요합니다. 
            // app.module.ts 에 있는 가드가 먼저 실행되기 때문에, 토큰을 제공해 달라는 메세지가 제공됩니다.
        }

        if(user.role !== requiredRole){
            throw new ForbiddenException( // 권한없는 Exception
                `이 작업을 수행할 권한이 없습니다. ${requiredRole} 권한이 필요합니다.`
            )
        }
    }
}
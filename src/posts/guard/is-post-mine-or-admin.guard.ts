import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesEnum } from "src/users/const/roles.const";

@Injectable()
export class IsPostMineOrAdmin implements CanActivate{
    constructor(){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        
        const {user} = req;

        if(!user){
            throw new UnauthorizedException(
                `사용자 정보를 가져올 수 없습니다.`)
        }

        if(user.role === RolesEnum.ADMIN){
            return true;
        }
    }
}
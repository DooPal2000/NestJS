import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req = context.switchToHttp().getRequest();

        // /posts
        // /common/image
        const path = req.originalUrl;
        
        const now = new Date();
        
        console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`)

        // return next.handle() 을 실행하는 순간
        // 라우트의 로직이 전부 실행되고 응답이 반환된다.
        // obseravable
        return next
            .handle()
    }

}
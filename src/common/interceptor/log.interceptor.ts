import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { response } from "express";
import { map, Observable, tap } from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req = context.switchToHttp().getRequest();

        // /posts
        // /common/image
        const path = req.originalUrl;

        const now = new Date();

        console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`)

        /**
         * 요청이 들어올 때 REQ 요청이 들어온 타임스탬프 찍기, RES 로 나갈 때 다시 타임스탬프를 찍는다.
         * return next.handle() 을 실행하는 순간
         * 라우트의 로직이 전부 실행되고 응답이 반환된다.
         * 아래 코드에서, return next 이후에 있는 부분은 observable 을 활용하여, 응답하는 값을 감시할 수 있도록 (추적 가능하도록) 콘솔에 찍는 과정이다.
         */
        return next
            .handle()
            .pipe(
                tap(
                    //(observable) => console.log(observable),

                    // [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
                    (observable) => console.log(`[RES] ${path} ${now.toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`),
                ),
                map(
                    (observable) => {
                        return {
                            message: '응답이 변경됐습니다.',
                            response: observable,
                        }
                    }
                ),
            );
    }

}
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { timestamp } from "rxjs";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();

        // 로그 파일 생성, 혹은 에러 모니터링 시스템에 API 콜 하기
        
        response
        .status(status)
        .json({
            statusCode: status,
            message: exception.message,
            timestamp: new Date().toLocaleString('kr'),
            path: request.url,
        })
    }
}
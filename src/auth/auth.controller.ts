import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('reigiser/email')
  postRegisterEmail(@Body('nickname') nickname: string,
    @Body('email') email:string,
    @Body('password', new MaxLengthPipe(8), new MinLengthPipe(3)) password: string,
  ){
    return this.authService.registerWithEmail({
      nickname,
      email,
      password,
    })
  }  
}

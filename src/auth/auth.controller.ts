import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(
    @Headers('authorization') rawToken: string,
  ){
    // email:password -> base64
    // cxvjkzxkclvjdifasd -> email:password
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

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

import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string){
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token,false);

    return {
      accessToken: newToken,
    }
  }
  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string){
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token,true);

    return {
      refreshToken: newToken,
    }
  }


  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(
    @Headers('authorization') rawToken: string,
  ) {
    // email:password -> base64
    // acncsjklded -> email:password
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    
    const credentials =  this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  // @Post('login/email')
  // @UseGuards(BasicTokenGuard)
  // postLoginEmail(
  //   @Headers('authorization') rawToken: string,
  // ){
  //   // email:password -> base64
  //   // cxvjkzxkclvjdifasd -> email:password
  //   const token = this.authService.extractTokenFromHeader(rawToken, false);

  //   const credentials = this.authService.decodeBasicToken(token);

  //   return this.authService.loginWithEmail(credentials);
  // }


  // @Post('register/email')
  // postRegisterEmail(@Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string) {
  //   return this.authService.registerWithEmail({
  //     nickname,
  //     email,
  //     password,
  //   })
  // }

  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }
}

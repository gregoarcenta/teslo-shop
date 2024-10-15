import { Controller, Post, Body, Get, Query, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard())
  @Get('logout')
  logout() {
    return {
      ok: true,
      message: 'Logout',
    };
  }
}

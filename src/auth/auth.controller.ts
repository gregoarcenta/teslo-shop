import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Auth, GetUser } from "./decorators";
import { User } from "./entities/user.entity";

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
  
  @Get('check-status')
  @Auth()
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCheckStatusResponse,
  ApiSignInResponse,
  ApiSignUpResponse
} from "../documentation/decorators/auth";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiSignUpResponse()
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiSignInResponse()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('check-status')
  @Auth()
  @ApiCheckStatusResponse()
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}

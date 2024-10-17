import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'test1@google.com', description: 'SignIn email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Test123', description: 'SignIn password' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;
}

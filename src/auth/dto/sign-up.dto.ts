import {
  IsEmail,
  IsLowercase,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpDto {
  @IsString()
  @MinLength(1)
  @Transform(({ value }) => value.toLowerCase().trim())
  fullName: string;

  @IsString()
  @IsEmail()
  @IsLowercase()
  email: string;

  /*@IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'The password must have a Uppercase, lowercase letter and a number'
    })*/
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @Transform(({ value }) => value.trim())
  password: string;
}
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import * as bcrypt from 'bcrypt';
import { SignInDto, SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { IjwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly handlerException: HandlerException,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, ...userData } = signUpDto;
    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      
      delete user.password;
      delete  user.isActive;
      delete  user.roles;
      return {
        user,
        access_token: await this.getJwtToken({ id: user.id }),
      };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'fullName', 'email', 'password'],
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    delete user.password;
    return {
      user,
      access_token: await this.getJwtToken({ id: user.id }),
    };
  }

  private async getJwtToken(payload: IjwtPayload) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}

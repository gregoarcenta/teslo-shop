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
    let user: User;

    try {
      user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
      console.log(user);
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

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

  async checkStatus(user:User){
    return {
      user,
      access_token: await this.getJwtToken({ id: user.id }),
    }
  }
  
  private async getJwtToken(payload: IjwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}

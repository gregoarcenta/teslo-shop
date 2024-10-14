import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly handlerException: HandlerException,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    const { password, ...userData } = createAuthDto;
    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      const newUser = await this.userRepository.save(user);
      delete newUser.password;
      return newUser;
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }
}

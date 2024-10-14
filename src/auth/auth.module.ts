import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HandlerException } from '../common/exceptions/handler.exception';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HandlerException],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}

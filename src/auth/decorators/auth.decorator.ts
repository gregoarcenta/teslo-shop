import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Role, Roles } from './roles.decorator';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard(), RolesGuard));
};

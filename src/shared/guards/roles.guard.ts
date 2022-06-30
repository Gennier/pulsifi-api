import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const authorizedRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }
    console.log(authorizedRoles);
    console.log('HITTT');
    if (user && authorizedRoles) {
      const isExistRole = authorizedRoles.some(
        (role: string) => role === user.role,
      );
      if (isExistRole) {
        return true;
      }

      return false;
    }

    return true;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles, Roles_Key } from '../decorators/roles.decorator';
import { Role } from '../enumes';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(Roles_Key, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!requiredRoles) {
      return true;
    }
    const hasRoles = requiredRoles.some((role) => {
      return user.role.includes(role);
    });
    if (hasRoles) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}

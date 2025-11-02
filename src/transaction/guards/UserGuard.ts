import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private userService: UsersService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = this.userService.findUserByEmail(request.user.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return true
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  // constructor(private readonly)
  async canActivate(context: ExecutionContext) {
    console.log('checking google...');
    const canActivate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    super.logIn(request);
    return canActivate;
  }
}

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  serializeUser(user: any, done: Function) {
    console.log('serializeUser...');
    done(null, user);
  }
  async deserializeUser(payload: any, done: Function) {
    console.log('deserializeUser...');
    const user = await this.usersService.findUserById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}

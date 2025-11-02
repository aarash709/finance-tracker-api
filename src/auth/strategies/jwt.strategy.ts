import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authservice: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    sub: string;
    first_name: string;
    email: string;
    role: string;
  }) {
    return {
      sub: payload.sub,
      first_name: payload.first_name,
      email: payload.email,
      role: payload.role,
    };
  }
}

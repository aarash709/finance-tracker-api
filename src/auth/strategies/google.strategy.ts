import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || "fallbackid",
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET") || "fallbacksecret",
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    // params: GoogleCallbackParameters,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { displayName, emails } = profile;
    const email = emails?.[0]?.value ?? '';

    if (!email) {
      console.error(
        'Critical failure: Google profile did not provide a primary email.',
      );
      throw new UnauthorizedException(
        'Authentication failed: Missing required email address.',
      );
    }
    console.log('create user in validate...');
    const user = await this.authService.validateOAuthUser({
      firstName: profile.displayName,
      email: email,
    });
    done(null, user);
    console.log('returning user in validate...');
    return user || null;
  }
}

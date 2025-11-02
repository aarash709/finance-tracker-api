import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportAuthController } from './passport.auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TransactionModule } from '../transaction/transaction.module';
import { GoogleOAuthStrategy } from './strategies/google.strategy';
import { GoogleGuard } from './guards/passport-google.guard';
import { GoogleAuthController } from './googleAuth.controller';
import { SessionSerializer } from './Serializer';

@Module({
  imports: [
    UsersModule,
    TransactionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController, PassportAuthController, GoogleAuthController],
  providers: [
    AuthService,
    GoogleGuard,
    LocalStrategy,
    JwtStrategy,
    GoogleOAuthStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}

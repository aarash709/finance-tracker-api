import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const sessionSecret = configService.get<string>('SESSION_SECRET')
  if (!sessionSecret) throw new Error('SESSION_SECRET must be set');

  app.enableCors();
  const allowedOrigin = configService.get<string>('CLIENT_ORIGIN');
  app.enableCors({
    origin: [allowedOrigin],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.use(session({
    secret: configService.get<string>('SESSION_SECRET') || "fallback_dev_secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: configService.get<string>('NODE_ENV') === 'production',
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Finance tracker')
    .setDescription('Finance tracker and manager API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerCustomOptions = { useGlobalPrefix: true };
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, options);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const sessionSecret = configService.get<string>('SESSION_SECRET');
  if (!sessionSecret) throw new Error('SESSION_SECRET must be set');
  app.setGlobalPrefix('api');
  setupSwagger(app);

  app.enableCors();
  const allowedOrigin = configService.get<string>('CLIENT_ORIGIN');
  app.enableCors({
    origin: [allowedOrigin],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.use(
    session({
      secret:
        configService.get<string>('SESSION_SECRET') || 'fallback_dev_secret',
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: configService.get<string>('NODE_ENV') === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
}

bootstrap();

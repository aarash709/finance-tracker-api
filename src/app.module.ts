import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { AccountsController } from './account/accounts.controller';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    CaslModule,
    TransactionModule,
    ConfigModule.forRoot({
      // envFilePath: path,
      // load: [configurations],
      // validationSchema: schema,
      isGlobal: true,
      // ignoreEnvFile: boolean,
      // ignoreEnvVars: boolean,
    }),
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

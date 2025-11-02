import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { UserGuard } from './guards/UserGuard';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [TransactionController],
  providers: [TransactionService, UserGuard, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}

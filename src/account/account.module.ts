import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountService } from './account.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [AccountsController],
    providers: [AccountService],
})
export class AccountModule { }

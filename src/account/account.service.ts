import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAccountDto } from './dto/AccountDto';
import { UpdateAccountDto } from './dto/UpdateAccountDto';

@Injectable()
export class AccountService {
    constructor(private readonly database: DatabaseService) { }

    async findAll(userId: number) {
        const user = await this.database.user.findFirst({ where: { id: 1 } });
        if (!user) {
            throw new UnauthorizedException();
        }
        const accounts = await this.database.account.findMany({
            where: { userId: userId },
            include: {
                transactions: {
                    select: {
                        amount: true,
                        type: true,
                    },
                },
            },
        });
        const accountBalance = await accounts.map((account) => {
            const income = account.transactions
                .filter((t) => t.type === 'INCOME')
                .reduce((sum, t) => sum + Number(t.amount), 0);
            const expense = account.transactions
                .filter((t) => t.type === 'EXPENSE')
                .reduce((sum, t) => sum + Number(t.amount), 0);
            const balance = income - expense;
            return {
                id: account.id,
                name: account.name,
                type: account.type,
                balance,
            };
        });
        return accountBalance;
    }

    async findOne(accountId: number, userid: number) {
        return this.database.account.findUnique({ where: { id: accountId, userId: userid } });
    }

    async create(createAccountDto: CreateAccountDto) {
        const existingAccount = await this.database.account.findFirst({
            where: { name: createAccountDto.name },
        });
        if (existingAccount) {
            throw new HttpException(
                'An account is already exsist for this user!',
                HttpStatus.CONFLICT,
            );
        }
        return this.database.account.create({
            data: createAccountDto
        });
    }

    async updateAccount(
        accountId: number,
        userId: number,
        updateAccountDto: UpdateAccountDto,
    ) {
        return this.database.account.update({
            where: { id: accountId, userId: userId },
            data: updateAccountDto,
        });
    }

    async removeAccount(accountId: number, userId: number) {
        return this.database.account.delete({
            where: {
                id: accountId,
                userId: userId,
            },
        });
    }

}

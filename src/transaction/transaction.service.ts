import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private database: DatabaseService) { }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    return this.database.transaction.create({
      data: createTransactionDto
    });
  }

  async findAll(user: { id: number; email: string }) {
    const existingUser = await this.database.user.findFirst({
      where: { id: user.id, email: user.email },
    });
    if (!existingUser) {
      throw new UnauthorizedException();
    }
    const allTransactions = await this.database.account.findMany(
      {
        where: { userId: existingUser.id },
        include: { transactions: true },
      });
    return allTransactions
  }

  async getFinantialSummary(
    userId: number,
    startDate?: string,
    endDate?: string,
  ) {
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);

    const dateFilter = {
      gte: startDate ? new Date(startDate) : defaultStartDate,
      lte: endDate ? new Date(endDate) : new Date(),
    };

    const allAccounts = await this.database.account.findMany({
      where: { userId },
      select: { id: true, name: true, type: true },
    });
    const accountIds = allAccounts.map(account => account.id)
    const [income, expenses] = await Promise.all([
      this.database.transaction.aggregate({
        where: {
          type: "INCOME", accountId: { in: accountIds }, date: dateFilter
        },
        _sum: { amount: true },
      }),
      this.database.transaction.aggregate({
        where: {
          type: "EXPENSE", accountId: { in: accountIds }, date: dateFilter
        },
        _sum: { amount: true },
      }),
    ]);

    const allTimeTotals = await this.database.transaction.groupBy({
      by: ['accountId', 'type'],
      where: { accountId: { in: accountIds } }, // 👈 FILTER BY ACCOUNT ID
      _sum: { amount: true },
    });

    const totalIncome = Number(income._sum.amount) || 0;
    const totalExpenses = Number(expenses._sum.amount) || 0;
    return {
      // totalBalance,
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      savings:
        totalIncome - totalExpenses,
      // accountBalances,
    };
  }

  async findOne(id: number) {
    return this.database.transaction.findUnique({
      where: {
        id,
      },
    });
  }


  async updateTransaction(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.database.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  async removeTransaction(id: number) {
    return this.database.transaction.delete({
      where: {
        id
      },
    });
  }

}

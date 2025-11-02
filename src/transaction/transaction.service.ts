import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { create } from 'domain';

@Injectable()
export class TransactionService {
  constructor(private database: DatabaseService) { }

  async createTransaction(createTransactionDto: Prisma.TransactionCreateInput) {
    return this.database.transaction.create({
      data: createTransactionDto,
    });
  }

  async createAccount(createAccountDto: Prisma.AccountCreateInput) {
    const existingAccount = await this.database.account.findFirst({
      where: { name: createAccountDto.name },
    });
    if (existingAccount) {
      throw new HttpException(
        'An account is already exsist for this user!',
        HttpStatus.CONFLICT,
      );
    }
    return this.database.account.create({ data: createAccountDto });
  }

  async findAll(user: { id: number; email: string }) {
    const existingUser = await this.database.user.findFirst({
      where: { id: user.id, email: user.email },
    });
    if (!existingUser) {
      throw new UnauthorizedException();
    }
    return this.database.transaction.findMany({
      where: { userId: existingUser.id },
      include: {
        account: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async findAllAcounts(userId: number) {
    const user = await this.database.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const accounts = await this.database.account.findMany({
      where: { userId: userId },
      include: {
        transactions: {
          where: {
            userId,
          },
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

  async getFinantialSummary(
    userId: number,
    startDate?: string,
    endDate?: string,
  ) {
    //work in progress
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const dateFilter = {
      gte: startDate ? new Date(startDate) : defaultStartDate,
      lte: endDate ? new Date(endDate) : new Date(),
    };
    const [income, expenses, billTotals, accounts] = await Promise.all([
      this.database.transaction.aggregate({
        where: {
          type: "INCOME", userId: userId, date: dateFilter
        },
        _sum: { amount: true },
      }),
      this.database.transaction.aggregate({
        where: { type: "EXPENSE", userId: userId, date: dateFilter },
        _sum: { amount: true },
      }),
      this.database.transaction.groupBy({
        by: ['category'],
        where: {
          date: dateFilter,
          type: 'EXPENSE',
          userId: userId,
          category: {
            in: [
              'BANK_FEES',
              'CITY_TAXES',
              'ELECTRICITY',
              'ENTERTAINMENT',
              'FOOD',
              'GAS',
              'INTERNET',
              'MORTGAGE',
              'TRANSPORT',
              'OTHER',
            ],
          },
        },
        _sum: { amount: true },
      }),
      this.database.account.findMany({
        where: { userId },
        include: {
          transactions: {
            where: {
              userId,
            },
            select: {
              amount: true,
              type: true,
            },
          },
        },
      }),
    ]);
    const accountBalances = accounts.map((account) => {
      const incomeSum = 
      account.transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const expenseSum = account.transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        accountId: account.id,
        accountName: account.name,
        balance: incomeSum - expenseSum,
      };
    });
    const totalBalance = accountBalances.reduce(
      (sum, account) => sum + account.balance,
      0,
    );
    return {
      totalBalance,
      totalIncome: Number(income._sum.amount) || 0,
      totalExpenses: Number(expenses._sum.amount) || 0,
      savings:
        (Number(income._sum.amount) || 0) - (Number(expenses._sum.amount) || 0),
      billTotals: billTotals.map((b) => ({
        category: b.category,
        total: Number(b._sum.amount) || 0,
      })),
      accountBalances,
    };
  }

  async findOne(id: number) {
    return this.database.transaction.findUnique({
      where: {
        id,
      },
    });
  }

  async updateAccount(
    accountId: number,
    userId: number,
    updateAccountDto: Prisma.AccountUpdateInput,
  ) {
    return this.database.account.update({
      where: { id: accountId, userId: userId },
      data: updateAccountDto,
    });
  }

  async updateTransaction(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.database.transaction.update({
      where: { id, userId: userId },
      data: updateTransactionDto,
    });
  }

  async removeTransaction(id: number, userId: number) {
    return this.database.transaction.delete({
      where: {
        id,
        userId: userId,
      },
    });
  }
  async removeAccount(id: number, userId: number) {
    return this.database.account.delete({
      where: {
        id,
        userId: userId,
      },
    });
  }
}

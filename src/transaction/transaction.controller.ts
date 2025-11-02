import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  Request,
  Query,
  BadRequestException,
  ParseDatePipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Prisma } from '@prisma/client';
import { UserGuard } from './guards/UserGuard';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';

@Controller('transaction')
@UseGuards(PassportJwtGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('new')
  async createTransaction(
    @Body() createExpenseDto: Prisma.TransactionCreateInput,
  ) {
    return this.transactionService.createTransaction(createExpenseDto);
  }

  @Post('account')
  async createAccount(@Body() createAccountDto: Prisma.AccountCreateInput) {
    return this.transactionService.createAccount(createAccountDto);
  }

  @Get('transactions')
  async findAllTransactions(@Request() req) {
    return this.transactionService.findAll(req.user);
  }

  @Get('accounts')
  async findAllAccounts(@Request() req) {
    const userId = req.user.sub;
    return this.transactionService.findAllAcounts(userId);
  }

  @Get('summary')
  async getFinantialSummary(
    @Request() req,
    @Query('startDate', new ParseDatePipe()) startDate: string,
    @Query('endDate', new ParseDatePipe()) endDate: string,
  ) {
    const userId = req.user.sub;
    if (new Date(startDate).getDate() > new Date(endDate).getDate()) {
      throw new BadRequestException('startDate must be before endDate');
    }
    return this.transactionService.getFinantialSummary(
      userId,
      startDate,
      endDate,
    );
  }

  @UseGuards(UserGuard)
  @Get('account')
  async findOneAccount(@Request() req) {
    return this.transactionService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch('account/:id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateAccountDto: Prisma.AccountUpdateInput,
    @Request() req,
  ) {
    return this.transactionService.updateAccount(
      +id,
      req.user.userId,
      updateAccountDto,
    );
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateAccountDto: Prisma.TransactionUpdateInput,
    @Request() req,
  ) {
    return this.transactionService.updateTransaction(
      +id,
      req.user.userId,
      updateAccountDto,
    );
  }

  @Delete(':id')
  async removeTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.transactionService.removeTransaction(+id, req.user.userId);
  }

  @Delete('account/:id')
  async removeAccount(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionService.removeAccount(+id, req.user.userId);
  }
}

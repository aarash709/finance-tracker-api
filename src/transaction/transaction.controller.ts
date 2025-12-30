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
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('transaction')
@UseGuards(PassportJwtGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('all')
  async findAll(@Request() req) {
    return this.transactionService.findAll(req.user);
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

  @Post('new')
  async create(@Body(ValidationPipe) createExpenseDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createExpenseDto);
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateAccountDto: UpdateTransactionDto,
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
    return this.transactionService.removeTransaction(+id);
  }
}

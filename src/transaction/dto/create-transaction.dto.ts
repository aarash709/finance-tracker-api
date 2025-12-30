import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @ApiProperty({ default: 'Example description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TransactionType })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TransactionType, {
    message: 'The transaction type must be INCOME or EXPENSE.',
  })
  @IsNotEmpty()
  type!: TransactionType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({ type: Date, default: new Date() })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date!: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountId!: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId?: string;
}

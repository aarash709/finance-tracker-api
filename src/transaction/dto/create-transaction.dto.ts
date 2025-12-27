import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';


export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}


export class CreateTransactionDto {
    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(TransactionType, {
        message: 'The transaction type must be INCOME or EXPENSE.',
    })
    @IsNotEmpty()
    type!: TransactionType;

    @IsNumber()
    @IsNotEmpty()
    amount!: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date!: Date;

    @IsNumber()
    @IsNotEmpty()
    accountId!: number;

    @IsOptional()
    @IsString()
    @IsUUID()
    categoryId?: string;
}

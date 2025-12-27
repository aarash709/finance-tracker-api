import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export enum AccountType {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
    CREDIT_CARD = 'CREDIT_CARD',
    LOAN = 'LOAN',
    INVESTMENT = 'INVESTMENT',
    ASSET = 'ASSET',
    CASH = 'CASH',
    OTHER = 'OTHER',
}
export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsNotEmpty()
    @IsEnum(AccountType, {
        message: `The account type must be one of the predefined types. Valid types are: CHECKING, SAVINGS, CREDIT_CARD, LOAN, INVESTMENT, ASSET, CASH, OTHER.`,
    })
    type!: AccountType;
    @IsNumber()
    @IsNotEmpty()
    userId!: number;
}



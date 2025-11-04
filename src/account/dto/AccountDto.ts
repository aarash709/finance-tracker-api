import { PartialType } from "@nestjs/mapped-types";

export class CreateAccountDto {
    name: string;
    type: AccountType;
    userId: number;
}



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
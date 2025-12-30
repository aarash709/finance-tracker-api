import { PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './AccountDto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

import { PartialType } from "@nestjs/mapped-types";
import { CreateAccountDto } from "./AccountDto";

export class UpdateAccountDto extends PartialType(CreateAccountDto) { }
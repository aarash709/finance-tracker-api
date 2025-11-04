import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Prisma } from '@prisma/client';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';
import { CreateAccountDto } from './dto/AccountDto';
import { UpdateAccountDto } from './dto/UpdateAccountDto';

@Controller('account')
@UseGuards(PassportJwtGuard)
export class AccountsController {
    constructor(private readonly accountService: AccountService) { }

    @Get("all")
    async findAll(@Req() req) {
        return this.accountService.findAll(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: string, @Req() req) {
        return this.accountService.findOne(+id, req.user.userId);
    }

    @Post('new')
    async create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountService.create(createAccountDto);
    }

    @Patch(':id')
    async updateAccount(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateAccountDto: UpdateAccountDto,
        @Req() req,
    ) {
        return this.accountService.updateAccount(
            +id,
            req.user.userId,
            updateAccountDto,
        );
    }

    @Delete(':id')
    async removeAccount(@Param('id', ParseIntPipe) id: string, @Req() req) {
        return this.accountService.removeAccount(+id, req.user.userId);
    }
}

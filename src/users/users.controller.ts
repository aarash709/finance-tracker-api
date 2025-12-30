import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enumes';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @Roles(Role.USER)
  @UseGuards(RoleAuthGuard, PassportJwtGuard)
  getUser(@Req() request) {
    return this.userService.findUserByEmail(request.user.email);
  }

  @Post()
  @Roles(Role.USER)
  @UseGuards(RoleAuthGuard, PassportJwtGuard)
  createUser(@Req() request) {
    return this.userService.createLocalUser(request.user.username);
  }

  @Delete()
  @Roles(Role.USER)
  @UseGuards(RoleAuthGuard, PassportJwtGuard)
  deleteUser(@Req() request) {
    return this.userService.deleteUserById(request.user.username);
  }
}

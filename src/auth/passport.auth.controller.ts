import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtGuard } from './guards/passport-jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth/v2')
export class PassportAuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportLocalGuard)
  @Post('login')
  async signIn(@Request() requset) {
    return this.authService.generateJWT(requset.user);
  }

  @ApiBearerAuth()
  @Get('userInfo')
  @UseGuards(PassportJwtGuard)
  async getUserInfo(@Request() requset) {
    return requset.user;
  }
}

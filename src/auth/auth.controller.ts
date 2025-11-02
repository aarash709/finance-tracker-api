import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportJwtGuard } from './guards/passport-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() input: { email: string; password: string }) {
    return this.authService.login(input);
  }

  @UseGuards(
    PassportJwtGuard,
    // RoleAuthGuard
  )
  @Get('user')
  // @Roles(Role.USER)
  getUserInfo(@Request() requset) {
    return requset.user;
  }

  @Post('signup')
  async signup(
    @Body(ValidationPipe)
    input: {
      displayName: string;
      email: string;
      password: string;
    },
  ) {
    return this.authService.localSignup(input);
  }
}

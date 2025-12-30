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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Create a user with email and password' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() input: { email: string; password: string }) {
    return this.authService.login(input);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Get logged in user info' })
  @UseGuards(PassportJwtGuard)
  @Get('user')
  // @Roles(Role.USER)
  getUserInfo(@Request() requset) {
    return requset.user;
  }

  @ApiOperation({ description: 'Login with email and password' })
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

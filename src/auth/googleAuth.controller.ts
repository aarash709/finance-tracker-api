import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { GoogleGuard } from './guards/passport-google.guard';
import { AuthService } from './auth.service';

@Controller('api')
export class GoogleAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth/google/login')
  @UseGuards(GoogleGuard)
  async handleLogin() {
    return { login: 'loggin in' };
  }

  @Get('auth/google/callback')
  @UseGuards(GoogleGuard)
  async handleRedirect(@Request() req, @Res() res) {
    if (!req.user) {
      return res.redirect('/login?error=true'); // Redirect to frontend login on failure
    }

    // 1. Generate JWT
    const accessToken = await this.authService.generateJWT(req.user);
    console.log('uesrname:' + req.user.first_name);
    console.log('token:' + accessToken + '\n');

    // 2. Set the JWT in an httpOnly cookie
    res.cookie('access_token', accessToken.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000 * 24 * 7, //7 days
    });

    return res.redirect('http://localhost:3000');
  }

  @Get('auth/google/logout')
  logout(@Res() res) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use 'secure' in production
      sameSite: 'strict',
      expires: new Date(0), // Set to a past date
    });

    res.redirect('http://localhost:3000/login');
  }
}

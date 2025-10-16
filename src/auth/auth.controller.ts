import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register() {}

  @Post('login')
  async login() {}

  @Get('refresh')
  async refresh() {}

  @Get('logout')
  async logout() {}
}

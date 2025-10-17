import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Request, Response } from 'express';
import { constants, cookieFactory } from '@common/helpers';
import { Cookies, UserAgent } from '@common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: AuthDto,
    @UserAgent() userAgent: string,
  ) {
    const tokens = await this.authService.register(registerDto, userAgent);

    const cookies = cookieFactory(req, res);

    cookies.set(
      constants.REFRESH_TOKEN,
      tokens.refreshToken,
      1000 * 60 * 60 * 24 * 30,
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: AuthDto,
    @UserAgent() userAgent: string,
  ) {
    const tokens = await this.authService.login(loginDto, userAgent);

    const cookies = cookieFactory(req, res);

    cookies.set(
      constants.REFRESH_TOKEN,
      tokens.refreshToken,
      1000 * 60 * 60 * 24 * 30,
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @Cookies(constants.REFRESH_TOKEN) refreshToken: string,
  ) {
    const cookies = cookieFactory(req, res);

    const tokens = await this.authService.refreshTokens(
      userAgent,
      refreshToken,
    );

    cookies.set(
      constants.REFRESH_TOKEN,
      tokens.refreshToken,
      1000 * 60 * 60 * 24 * 30,
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Cookies(constants.REFRESH_TOKEN) refreshToken: string,
  ) {
    const cookies = cookieFactory(req, res);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const result = await this.authService.logout(refreshToken);

    cookies.remove(constants.REFRESH_TOKEN);

    return {
      userAgent: result.userAgent,
    };
  }
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { JwtPayload } from '../tokens/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async register(registerDto: AuthDto, userAgent: string) {
    const { email } = registerDto;

    const existingUser = await this.usersService.findOne(email);

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const user = await this.usersService.create(registerDto);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return await this.tokensService.generateTokens(payload, userAgent);
  }

  async login(loginDto: AuthDto, userAgent: string) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMathcing = await this.usersService.verifyPassword(
      user.password,
      password,
    );

    if (!isPasswordMathcing) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return await this.tokensService.generateTokens(payload, userAgent);
  }

  async refreshTokens(userAgent: string, refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    if (await this.tokensService.isMayRefreshTokens(refreshToken)) {
      const token = await this.tokensService.deleteRefreshToken(refreshToken);
      const user = await this.usersService.findOne(token.userId);

      const payload: JwtPayload = {
        sub: user!.id,
        email: user!.email,
        role: user!.role,
      };

      return this.tokensService.generateTokens(payload, userAgent);
    }

    await this.tokensService.deleteRefreshToken(refreshToken);

    throw new UnauthorizedException();
  }

  async logout(refreshToken: string) {
    const token = await this.tokensService.findRefreshToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.tokensService.deleteRefreshToken(token.token);
  }
}

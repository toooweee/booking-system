import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { payloadFactory } from '../tokens/helpers';

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

    const payload = payloadFactory(user);

    return await this.tokensService.generateTokens(payload, userAgent);
  }

  async login(loginDto: AuthDto, userAgent: string) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOne(email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await this.usersService.verifyPassword(
      user.password,
      password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = payloadFactory(user);

    return await this.tokensService.generateTokens(payload, userAgent);
  }

  async refreshTokens(userAgent: string, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const existingToken =
      await this.tokensService.findRefreshToken(refreshToken);

    if (!existingToken) {
      throw new UnauthorizedException();
    }

    if (new Date() >= new Date(existingToken.expiresAt)) {
      await this.tokensService.deleteRefreshToken(refreshToken);

      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(existingToken.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.tokensService.deleteRefreshToken(refreshToken);

    const payload = payloadFactory(user);

    return this.tokensService.generateTokens(payload, userAgent);
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const token = await this.tokensService.findRefreshToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.tokensService.deleteRefreshToken(token.token);
  }
}

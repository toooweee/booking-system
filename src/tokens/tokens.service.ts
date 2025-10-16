import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from './jwt-payload.interface';
import { add } from 'date-fns';
import { EnvService } from '../env/env.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
  ) {}

  async generateTokens(payload: JwtPayload, userAgent: string) {
    const accessToken = await this.jwtService.signAsync(payload);
    const { token } = await this.saveRefreshToken(payload.sub, userAgent);

    return {
      accessToken,
      refreshToken: token,
    };
  }

  async saveRefreshToken(userId: string, userAgent: string) {
    const token = uuidv4();

    return this.prismaService.token.upsert({
      where: {
        userId_userAgent: {
          userId,
          userAgent,
        },
      },
      update: {
        token,
        expiresAt: new Date(
          add(new Date(), { days: this.getRefreshTokenExpiresEnv() }),
        ),
      },
      create: {
        userId,
        userAgent,
        token,
        expiresAt: new Date(
          add(new Date(), { days: this.getRefreshTokenExpiresEnv() }),
        ),
      },
      select: {
        token: true,
      },
    });
  }

  async isMayRefreshTokens(refreshToken: string) {
    const existingToken = await this.findRefreshToken(refreshToken);

    if (!existingToken) {
      return false;
    }

    return new Date() <= new Date(existingToken.expiresAt);
  }

  async findRefreshToken(token: string) {
    return this.prismaService.token.findUnique({
      where: {
        token,
      },
    });
  }

  private getRefreshTokenExpiresEnv() {
    return parseInt(this.envService.get('JWT_RT_EXPIRES'));
  }

  async deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({
      where: {
        token,
      },
    });
  }
}

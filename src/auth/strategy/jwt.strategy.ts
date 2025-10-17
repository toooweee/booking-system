import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../../env/env.service';
import { JwtPayload } from '../../tokens/interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { strategies } from '../constants/strategies.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, strategies.JWT) {
  constructor(
    envService: EnvService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

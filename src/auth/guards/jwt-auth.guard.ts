import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { strategies } from '../constants/strategies.constant';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@common/decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard(strategies.JWT) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

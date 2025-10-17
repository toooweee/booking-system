import { User } from '@prisma/client';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const payloadFactory = (user: Omit<User, 'password'>) => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return payload;
};

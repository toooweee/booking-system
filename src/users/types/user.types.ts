import { User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;

export type CurrentUserType = UserWithoutPassword;

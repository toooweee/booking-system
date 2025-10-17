import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { CreateUserDto } from './dto';
import { User } from '@prisma/client';
import { UserWithoutPassword } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne<T extends boolean>(
    idOrEmail: string,
    includePassword?: T,
  ): Promise<T extends true ? User | null : UserWithoutPassword | null> {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
      select: {
        id: true,
        email: true,
        role: true,
        password: includePassword ? true : undefined,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;

    const hashedPassword = await argon.hash(password);

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async me(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async verifyPassword(hashedPassword: string, password: string) {
    return argon.verify(hashedPassword, password);
  }
}

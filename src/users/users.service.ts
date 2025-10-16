import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(idOrEmail: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
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

  async verifyPassword(hashedPassword: string, password: string) {
    return argon.verify(hashedPassword, password);
  }
}

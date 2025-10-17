import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
      },
    });
  }

  async findAll() {
    return this.prismaService.event.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: {
        id,
      },
    });
  }
}

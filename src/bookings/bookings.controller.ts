import { Controller, Get, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('events/:id')
  async findAllByEvent(@Param('id') id: string) {}

  @Post('reserve')
  async create() {}

  @Get('me')
  async findMyBookings() {}
}

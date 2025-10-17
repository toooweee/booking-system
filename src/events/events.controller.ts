import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto';
import { Public } from '@common/decorators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}

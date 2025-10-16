import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { EventsModule } from './events/events.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [AuthModule, UsersModule, BookingsModule, EventsModule, EnvModule],
})
export class AppModule {}

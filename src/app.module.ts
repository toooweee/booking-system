import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { EventsModule } from './events/events.module';
import { EnvModule } from './env/env.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokensModule } from './tokens/tokens.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BookingsModule,
    EventsModule,
    EnvModule,
    PrismaModule,
    TokensModule,
    ProvidersModule,
  ],
})
export class AppModule {}

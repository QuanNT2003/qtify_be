import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule } from '@nestjs/config';

import { ServiceModule } from 'src/service/service.module';
import { GenreController } from './genre.controller';
// import { ParticipantController } from './participant.controller';

@Module({
  imports: [
    ServiceModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '15m' },
    //   }),
    // }),
  ],
  controllers: [GenreController],
})
export class ControllerModule {}

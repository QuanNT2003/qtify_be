import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './model/entity/album.entity';
import { Artist } from './model/entity/artist.entity';
import { Follow } from './model/entity/follow.entity';
import { Genre } from './model/entity/genre.entity';
import { ListeningHistory } from './model/entity/listening-history.entity';
import { PlaylistSong } from './model/entity/playlist-song.entity';
import { Playlist } from './model/entity/playlist.entity';
import { SongArtist } from './model/entity/song-artist.entity';
import { SongGenre } from './model/entity/song-genre.entity';
import { Song } from './model/entity/song.entity';
import { UserLike } from './model/entity/user-like.entity';
import { User } from './model/entity/user.entity';
import { ServiceModule } from './service/service.module';
import { ControllerModule } from './controller/controller.module';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './common/strategies/jwt-refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { RolesGuard } from './common/guard/roles.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [
          Album,
          Artist,
          Follow,
          Genre,
          ListeningHistory,
          PlaylistSong,
          Playlist,
          SongArtist,
          SongGenre,
          Song,
          UserLike,
          User,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        cloud_name: configService.get<string>('CLOUD_NAME'),
        api_key: configService.get<string>('CLOUD_API_KEY'),
        api_secret: configService.get<string>('CLOUD_API_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ServiceModule,
    ControllerModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

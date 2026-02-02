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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    ServiceModule,
    ControllerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

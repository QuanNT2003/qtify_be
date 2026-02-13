import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule } from '@nestjs/config';

import { ServiceModule } from 'src/service/service.module';
import { GenreController } from './genre.controller';
import { ArtistController } from './artist.controller';
import { AlbumController } from './album.controller';
import { SongController } from './song.controller';
import { UserController } from './user.controller';
import { PlaylistController } from './playlist.controller';
import { FollowController } from './follow.controller';
import { ListeningHistoryController } from './listening-history.controller';
import { PlaylistSongController } from './playlist-song.controller';
import { SongArtistController } from './song-artist.controller';
import { SongGenreController } from './song-genre.controller';
import { UserLikeController } from './user-like.controller';
import { AuthController } from './auth.controller';
// import { ParticipantController } from './participant.controller';

@Module({
  imports: [ServiceModule],
  controllers: [
    GenreController,
    ArtistController,
    AlbumController,
    SongController,
    UserController,
    PlaylistController,
    FollowController,
    ListeningHistoryController,
    PlaylistSongController,
    SongArtistController,
    SongGenreController,
    UserLikeController,
    AuthController,
  ],
})
export class ControllerModule {}

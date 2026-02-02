import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { Artist } from './artist.entity';
import { Follow } from './follow.entity';
import { Genre } from './genre.entity';
import { ListeningHistory } from './listening-history.entity';
import { PlaylistSong } from './playlist-song.entity';
import { Playlist } from './playlist.entity';
import { SongArtist } from './song-artist.entity';
import { SongGenre } from './song-genre.entity';
import { Song } from './song.entity';
import { UserLike } from './user-like.entity';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntityModule {}

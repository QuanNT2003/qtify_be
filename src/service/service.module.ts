import { Global, Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { EntityModule } from 'src/model/entity/entity.module';
import { GenreService } from './genre.service';
import { ArtistService } from './artist.service';
import { CloudinaryService } from './cloudinary.service';
import { AlbumService } from './album.service';
import { SongService } from './song.service';
import { UserService } from './user.service';
import { PlaylistService } from './playlist.service';
import { FollowService } from './follow.service';
import { ListeningHistoryService } from './listening-history.service';
import { PlaylistSongService } from './playlist-song.service';
import { SongArtistService } from './song-artist.service';
import { SongGenreService } from './song-genre.service';
import { UserLikeService } from './user-like.service';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    EntityModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '1d' },
    //   }),
    // }),
  ],
  providers: [
    GenreService,
    ArtistService,
    CloudinaryService,
    AlbumService,
    SongService,
    UserService,
    PlaylistService,
    FollowService,
    ListeningHistoryService,
    PlaylistSongService,
    SongArtistService,
    SongGenreService,
    UserLikeService,
    AuthService,
  ],
  exports: [
    GenreService,
    ArtistService,
    CloudinaryService,
    AlbumService,
    SongService,
    UserService,
    PlaylistService,
    FollowService,
    ListeningHistoryService,
    PlaylistSongService,
    SongArtistService,
    SongGenreService,
    UserLikeService,
    AuthService,
  ],
})
export class ServiceModule {}

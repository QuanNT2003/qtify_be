import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaylistSongDto } from '../model/dto/PlaylistSong/create-playlist-song.dto';
import { PlaylistSong } from 'src/model/entity/playlist-song.entity';

@Injectable()
export class PlaylistSongService {
  constructor(
    @InjectRepository(PlaylistSong)
    private playlistSongRepository: Repository<PlaylistSong>,
  ) {}

  async create(createPlaylistSongDto: CreatePlaylistSongDto) {
    const playlistSong = this.playlistSongRepository.create(
      createPlaylistSongDto,
    );
    return this.playlistSongRepository.save(playlistSong);
  }

  findByPlaylist(playlistId: string) {
    return this.playlistSongRepository.find({
      where: { playlist_id: playlistId },
    });
  }

  async remove(playlistId: string, songId: string) {
    const playlistSong = await this.playlistSongRepository.findOne({
      where: { playlist_id: playlistId, song_id: songId },
    });
    if (!playlistSong) {
      throw new NotFoundException('Playlist song not found');
    }
    return this.playlistSongRepository.remove(playlistSong);
  }
}

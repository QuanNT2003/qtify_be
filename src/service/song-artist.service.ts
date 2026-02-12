import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongArtistDto } from '../model/dto/SongArtist/create-song-artist.dto';
import { SongArtist, ArtistRole } from 'src/model/entity/song-artist.entity';

@Injectable()
export class SongArtistService {
  constructor(
    @InjectRepository(SongArtist)
    private songArtistRepository: Repository<SongArtist>,
  ) {}

  async create(createSongArtistDto: CreateSongArtistDto) {
    const songArtist = this.songArtistRepository.create(createSongArtistDto);
    return this.songArtistRepository.save(songArtist);
  }

  findBySong(songId: string) {
    return this.songArtistRepository.find({
      where: { song_id: songId },
    });
  }

  findByArtist(artistId: string) {
    return this.songArtistRepository.find({
      where: { artist_id: artistId },
    });
  }

  async updateRole(songId: string, artistId: string, role: ArtistRole) {
    const songArtist = await this.songArtistRepository.findOne({
      where: { song_id: songId, artist_id: artistId },
    });
    if (!songArtist) {
      throw new NotFoundException('Song artist relationship not found');
    }
    songArtist.role = role;
    return this.songArtistRepository.save(songArtist);
  }

  async remove(songId: string, artistId: string) {
    const songArtist = await this.songArtistRepository.findOne({
      where: { song_id: songId, artist_id: artistId },
    });
    if (!songArtist) {
      throw new NotFoundException('Song artist relationship not found');
    }
    return this.songArtistRepository.remove(songArtist);
  }
}

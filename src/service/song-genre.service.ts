import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongGenreDto } from '../model/dto/SongGenre/create-song-genre.dto';
import { SongGenre } from 'src/model/entity/song-genre.entity';

@Injectable()
export class SongGenreService {
  constructor(
    @InjectRepository(SongGenre)
    private songGenreRepository: Repository<SongGenre>,
  ) {}

  async create(createSongGenreDto: CreateSongGenreDto) {
    const songGenre = this.songGenreRepository.create(createSongGenreDto);
    return this.songGenreRepository.save(songGenre);
  }

  findBySong(songId: string) {
    return this.songGenreRepository.find({
      where: { song_id: songId },
    });
  }

  findByGenre(genreId: string) {
    return this.songGenreRepository.find({
      where: { genre_id: genreId },
    });
  }

  async remove(songId: string, genreId: string) {
    const songGenre = await this.songGenreRepository.findOne({
      where: { song_id: songId, genre_id: genreId },
    });
    if (!songGenre) {
      throw new NotFoundException('Song genre relationship not found');
    }
    return this.songGenreRepository.remove(songGenre);
  }
}

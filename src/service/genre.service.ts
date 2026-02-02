import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from '../model/dto/Genre/create-genre.dto';
import { UpdateGenreDto } from '../model/dto/Genre/update-genre.dto';
import { Genre } from 'src/model/entity/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}
  create(createGenreDto: CreateGenreDto) {
    const genre = this.genreRepository.create({
      ...createGenreDto,
    });
    return this.genreRepository.save(genre);
  }

  findAll() {
    return this.genreRepository.find();
  }

  findOne(id: string) {
    return this.genreRepository.findOne({ where: { id } });
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    Object.assign(genre, updateGenreDto);
    return this.genreRepository.save(genre);
  }

  async remove(id: string) {
    const genre = await this.findOne(id);
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    return this.genreRepository.remove(genre);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateGenreDto } from '../model/dto/Genre/create-genre.dto';
import { UpdateGenreDto } from '../model/dto/Genre/update-genre.dto';
import { Genre } from 'src/model/entity/genre.entity';
import { GetGenresDto } from '../model/dto/Genre/get-genres.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

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

  async findAll(query: GetGenresDto): Promise<PaginatedResult<Genre>> {
    const where = query.name ? { name: ILike(`%${query.name}%`) } : {};

    const [data, total] = await this.genreRepository.findAndCount({
      skip: query.skip,
      take: query.per_page,
      where,
    });

    const total_page = Math.ceil(total / query.per_page);

    return {
      data,
      pagination: {
        page: query.page,
        per_page: query.per_page,
        total,
        total_page,
      },
    };
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

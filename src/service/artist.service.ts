import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from '../model/dto/create-artist.dto';
import { UpdateArtistDto } from '../model/dto/update-artist.dto';
import { Artist } from 'src/model/entity/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const artist = this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(artist);
  }

  findAll() {
    return this.artistRepository.find();
  }

  findOne(id: string) {
    return this.artistRepository.findOne({ where: { id } });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(artist);
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return this.artistRepository.remove(artist);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from '../model/dto/Artist/create-artist.dto';
import { UpdateArtistDto } from '../model/dto/Artist/update-artist.dto';
import { Artist } from 'src/model/entity/artist.entity';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createArtistDto: CreateArtistDto, file?: Express.Multer.File) {
    const artist = this.artistRepository.create(createArtistDto);

    // Upload avatar if file is provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'artists',
      );
      artist.avatar_url = uploadResult.secure_url;
    }

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

  async uploadAvatar(id: string, file: Express.Multer.File) {
    const artist = await this.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'artists',
    );

    artist.avatar_url = uploadResult.secure_url;
    return this.artistRepository.save(artist);
  }
}

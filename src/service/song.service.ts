import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongDto } from '../model/dto/Song/create-song.dto';
import { UpdateSongDto } from '../model/dto/Song/update-song.dto';
import { Song } from 'src/model/entity/song.entity';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createSongDto: CreateSongDto) {
    const song = this.songRepository.create(createSongDto);
    return this.songRepository.save(song);
  }

  findAll() {
    return this.songRepository.find();
  }

  findOne(id: string) {
    return this.songRepository.findOne({ where: { id } });
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    const song = await this.findOne(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    Object.assign(song, updateSongDto);
    return this.songRepository.save(song);
  }

  async remove(id: string) {
    const song = await this.findOne(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    if (song.file_url) {
      // Cloudinary treats audio files as 'video' resource type
      await this.cloudinaryService.deleteFile(song.file_url, 'video');
    }

    return this.songRepository.remove(song);
  }

  async uploadAudioFile(id: string, file: Express.Multer.File) {
    const song = await this.findOne(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'songs',
      'video', // Cloudinary treats audio as video
    );

    song.file_url = uploadResult.secure_url;
    return this.songRepository.save(song);
  }
}

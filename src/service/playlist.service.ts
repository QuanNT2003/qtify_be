import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from '../model/dto/Playlist/create-playlist.dto';
import { UpdatePlaylistDto } from '../model/dto/Playlist/update-playlist.dto';
import { Playlist } from 'src/model/entity/playlist.entity';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createPlaylistDto: CreatePlaylistDto,
    file?: Express.Multer.File,
  ) {
    const playlist = this.playlistRepository.create(createPlaylistDto);

    // Upload cover image if file is provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'playlists',
      );
      playlist.cover_image_url = uploadResult.secure_url;
    }

    return this.playlistRepository.save(playlist);
  }

  findAll() {
    return this.playlistRepository.find();
  }

  findOne(id: string) {
    return this.playlistRepository.findOne({ where: { id } });
  }

  findByUser(userId: string) {
    return this.playlistRepository.find({ where: { user_id: userId } });
  }

  async update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.findOne(id);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    Object.assign(playlist, updatePlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async remove(id: string) {
    const playlist = await this.findOne(id);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.cover_image_url) {
      await this.cloudinaryService.deleteFile(
        playlist.cover_image_url,
        'image',
      );
    }

    return this.playlistRepository.remove(playlist);
  }

  async uploadCoverImage(id: string, file: Express.Multer.File) {
    const playlist = await this.findOne(id);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'playlists',
    );

    playlist.cover_image_url = uploadResult.secure_url;
    return this.playlistRepository.save(playlist);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongDto } from '../model/dto/Song/create-song.dto';
import { UpdateSongDto } from '../model/dto/Song/update-song.dto';
import { Song } from 'src/model/entity/song.entity';
import { CloudinaryService } from './cloudinary.service';
import { PageOptionsDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { SongGenreService } from './song-genre.service';
import { SongArtistService } from './song-artist.service';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private cloudinaryService: CloudinaryService,
    private songGenreService: SongGenreService,
    private songArtistService: SongArtistService,
  ) {}

  async create(createSongDto: CreateSongDto, file?: Express.Multer.File) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'songs',
        'video',
      );
      createSongDto.file_url = uploadResult.secure_url;
    }

    if (!createSongDto.file_url) {
      throw new NotFoundException('Audio file or file_url is required');
    }

    // Normalize genre_ids and artist_ids (FormData may send them as strings)
    const normalizeArrayField = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        return field
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id);
      }
      return [];
    };

    const genre_ids = normalizeArrayField(createSongDto.genre_ids);
    const artist_ids = normalizeArrayField(createSongDto.artist_ids);

    const song = this.songRepository.create(createSongDto);
    const savedSong = await this.songRepository.save(song);

    // Create Song - Genre relationships
    if (genre_ids.length > 0) {
      for (const genreId of genre_ids) {
        await this.songGenreService.create({
          song_id: savedSong.id,
          genre_id: genreId,
        });
      }
    }

    // Create Song - Artist relationships (Featured artists)
    if (artist_ids.length > 0) {
      for (const artistId of artist_ids) {
        await this.songArtistService.create({
          song_id: savedSong.id,
          artist_id: artistId,
          // Default role is FEATURED as per DTO
        });
      }
    }

    return savedSong;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResult<Song>> {
    const [data, total] = await this.songRepository.findAndCount({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.per_page,
      relations: [
        'artist',
        'featured_artists',
        'featured_artists.artist',
        'genres',
        'genres.genre',
      ],
    });

    const total_page = Math.ceil(total / pageOptionsDto.per_page);

    return {
      data,
      pagination: {
        page: pageOptionsDto.page,
        per_page: pageOptionsDto.per_page,
        total,
        total_page,
      },
    };
  }

  findOne(id: string) {
    return this.songRepository.findOne({
      where: { id },
      relations: [
        'artist',
        'featured_artists',
        'featured_artists.artist',
        'genres',
        'genres.genre',
      ],
    });
  }

  async update(
    id: string,
    updateSongDto: UpdateSongDto,
    file?: Express.Multer.File,
  ) {
    const song = await this.findOne(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    // Handle audio file update
    if (file) {
      // Delete old file if exists
      if (song.file_url) {
        await this.cloudinaryService.deleteFile(song.file_url, 'video');
      }

      // Upload new file
      const uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'songs',
        'video',
      );
      song.file_url = uploadResult.secure_url;
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

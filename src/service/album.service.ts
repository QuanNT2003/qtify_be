import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from '../model/dto/Album/create-album.dto';
import { UpdateAlbumDto } from '../model/dto/Album/update-album.dto';
import { Album } from 'src/model/entity/album.entity';
import { CloudinaryService } from './cloudinary.service';
import { PageOptionsDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, file?: Express.Multer.File) {
    const album = this.albumRepository.create(createAlbumDto);

    // Upload cover image if file is provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'albums',
      );
      album.cover_image_url = uploadResult.secure_url;
    }

    return this.albumRepository.save(album);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResult<Album>> {
    const [data, total] = await this.albumRepository.findAndCount({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.per_page,
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
    return this.albumRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
    file?: Express.Multer.File,
  ) {
    const album = await this.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    // Handle image update
    if (file) {
      // Delete old image if exists
      if (album.cover_image_url) {
        await this.cloudinaryService.deleteFile(album.cover_image_url, 'image');
      }

      // Upload new image
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'albums',
      );
      album.cover_image_url = uploadResult.secure_url;
    }

    Object.assign(album, updateAlbumDto);
    return this.albumRepository.save(album);
  }

  async remove(id: string) {
    const album = await this.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (album.cover_image_url) {
      await this.cloudinaryService.deleteFile(album.cover_image_url, 'image');
    }

    return this.albumRepository.remove(album);
  }

  async uploadCoverImage(id: string, file: Express.Multer.File) {
    const album = await this.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'albums',
    );

    album.cover_image_url = uploadResult.secure_url;
    return this.albumRepository.save(album);
  }
}

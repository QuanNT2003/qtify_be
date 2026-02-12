import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { AlbumService } from '../service/album.service';
import { CreateAlbumDto } from '../model/dto/Album/create-album.dto';
import { UpdateAlbumDto } from '../model/dto/Album/update-album.dto';

@Controller('album')
@ApiTags('Album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({ summary: 'Create an album with optional cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        artist_id: { type: 'string' },
        release_date: { type: 'string', format: 'date' },
        type: { type: 'string', enum: ['SINGLE', 'ALBUM', 'EP'] },
        cover_image_url: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['title', 'artist_id', 'release_date'],
    },
  })
  @ApiResponse({ status: 201, description: 'Album created' })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createAlbumDto: CreateAlbumDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.albumService.create(createAlbumDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Find all albums' })
  @ApiResponse({ status: 200, description: 'Albums found' })
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an album by ID' })
  @ApiResponse({ status: 200, description: 'Album found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an album by ID' })
  @ApiResponse({ status: 200, description: 'Album updated' })
  @ApiParam({ name: 'id', type: 'string' })
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an album by ID' })
  @ApiResponse({ status: 200, description: 'Album deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }

  @Post(':id/cover')
  @ApiOperation({ summary: 'Upload album cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cover image uploaded' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  uploadCoverImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.albumService.uploadCoverImage(id, file);
  }
}

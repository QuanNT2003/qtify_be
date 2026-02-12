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
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SongService } from '../service/song.service';
import { CreateSongDto } from '../model/dto/Song/create-song.dto';
import { UpdateSongDto } from '../model/dto/Song/update-song.dto';
import { PageOptionsDto } from '../common/dto/pagination-query.dto';

@Controller('song')
@ApiTags('Song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  @ApiOperation({ summary: 'Create a song' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        album_id: { type: 'string' },
        artist_id: { type: 'string' },
        duration: { type: 'integer' },
        file_url: { type: 'string' },
        track_number: { type: 'integer' },
        lyrics: { type: 'string' },
        genre_ids: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        artist_ids: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['title', 'artist_id', 'duration'],
    },
  })
  @ApiResponse({ status: 201, description: 'Song created' })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.songService.create(createSongDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Find all songs with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Songs found' })
  findAll(@Query() pageOptions: PageOptionsDto) {
    return this.songService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a song by ID' })
  @ApiResponse({ status: 200, description: 'Song found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a song by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        album_id: { type: 'string' },
        artist_id: { type: 'string' },
        duration: { type: 'integer' },
        file_url: { type: 'string' },
        track_number: { type: 'integer' },
        lyrics: { type: 'string' },
        genre_ids: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        artist_ids: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Song updated' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.songService.update(id, updateSongDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a song by ID' })
  @ApiResponse({ status: 200, description: 'Song deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.songService.remove(id);
  }

  @Post(':id/audio')
  @ApiOperation({ summary: 'Upload song audio file' })
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
  @ApiResponse({ status: 200, description: 'Audio file uploaded' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  uploadAudioFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.songService.uploadAudioFile(id, file);
  }
}

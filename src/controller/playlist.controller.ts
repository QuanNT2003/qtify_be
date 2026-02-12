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
import { PlaylistService } from '../service/playlist.service';
import { CreatePlaylistDto } from '../model/dto/Playlist/create-playlist.dto';
import { UpdatePlaylistDto } from '../model/dto/Playlist/update-playlist.dto';
import { PageOptionsDto } from '../common/dto/pagination-query.dto';

@Controller('playlist')
@ApiTags('Playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a playlist with optional cover' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        is_public: { type: 'boolean' },
        cover_image_url: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['user_id', 'title'],
    },
  })
  @ApiResponse({ status: 201, description: 'Playlist created' })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.playlistService.create(createPlaylistDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Find all playlists with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Playlists found' })
  findAll(@Query() pageOptions: PageOptionsDto) {
    return this.playlistService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Find playlists by user ID' })
  @ApiResponse({ status: 200, description: 'User playlists found' })
  @ApiParam({ name: 'userId', type: 'string' })
  findByUser(@Param('userId') userId: string) {
    return this.playlistService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a playlist by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        is_public: { type: 'boolean' },
        cover_image_url: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Playlist updated' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.playlistService.update(id, updatePlaylistDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.playlistService.remove(id);
  }

  @Post(':id/cover')
  @ApiOperation({ summary: 'Upload playlist cover image' })
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
    return this.playlistService.uploadCoverImage(id, file);
  }
}

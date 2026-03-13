import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { PlaylistService } from '../service/playlist.service';
import { CreatePlaylistDto } from '../model/dto/Playlist/create-playlist.dto';
import { UpdatePlaylistDto } from '../model/dto/Playlist/update-playlist.dto';
import { PageOptionsDto } from '../common/dto/pagination-query.dto';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

@ApiBearerAuth()
@Controller('playlist')
@ApiTags('Playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a playlist' })
  @ApiResponse({ status: 201, description: 'Playlist created' })
  create(
    @Req() req: AuthRequest,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ) {
    return this.playlistService.create(req.user.id, createPlaylistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all playlists with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Playlists found' })
  findAll(@Req() req: AuthRequest, @Query() pageOptions: PageOptionsDto) {
    return this.playlistService.findAll(req.user.id, pageOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.playlistService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist updated' })
  @ApiParam({ name: 'id', type: 'string' })
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.update(id, req.user.id, updatePlaylistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.playlistService.remove(id, req.user.id);
  }
}

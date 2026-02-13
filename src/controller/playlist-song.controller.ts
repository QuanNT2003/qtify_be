import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { PlaylistSongService } from '../service/playlist-song.service';
import { CreatePlaylistSongDto } from '../model/dto/PlaylistSong/create-playlist-song.dto';

@ApiBearerAuth()
@Controller('playlist-song')
@ApiTags('PlaylistSong')
export class PlaylistSongController {
  constructor(private readonly playlistSongService: PlaylistSongService) {}

  @Post()
  @ApiOperation({ summary: 'Add a song to a playlist' })
  @ApiResponse({ status: 201, description: 'Song added to playlist' })
  create(@Body() createPlaylistSongDto: CreatePlaylistSongDto) {
    return this.playlistSongService.create(createPlaylistSongDto);
  }

  @Get('playlist/:playlistId')
  @ApiOperation({ summary: 'Get all songs in a playlist' })
  @ApiResponse({ status: 200, description: 'Playlist songs found' })
  @ApiParam({ name: 'playlistId', type: 'string' })
  findByPlaylist(@Param('playlistId') playlistId: string) {
    return this.playlistSongService.findByPlaylist(playlistId);
  }

  @Patch(':playlistId/:songId/order')
  @ApiOperation({ summary: 'Update song order in playlist' })
  @ApiResponse({ status: 200, description: 'Order updated' })
  @ApiParam({ name: 'playlistId', type: 'string' })
  @ApiParam({ name: 'songId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        order_index: { type: 'number' },
      },
    },
  })
  updateOrder(
    @Param('playlistId') playlistId: string,
    @Param('songId') songId: string,
    @Body('order_index') orderIndex: number,
  ) {
    return this.playlistSongService.updateOrder(playlistId, songId, orderIndex);
  }

  @Delete(':playlistId/:songId')
  @ApiOperation({ summary: 'Remove song from playlist' })
  @ApiResponse({ status: 200, description: 'Song removed from playlist' })
  @ApiParam({ name: 'playlistId', type: 'string' })
  @ApiParam({ name: 'songId', type: 'string' })
  remove(
    @Param('playlistId') playlistId: string,
    @Param('songId') songId: string,
  ) {
    return this.playlistSongService.remove(playlistId, songId);
  }
}

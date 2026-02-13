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
import { SongArtistService } from '../service/song-artist.service';
import { CreateSongArtistDto } from '../model/dto/SongArtist/create-song-artist.dto';
import { ArtistRole } from 'src/model/entity/song-artist.entity';

@ApiBearerAuth()
@Controller('song-artist')
@ApiTags('SongArtist')
export class SongArtistController {
  constructor(private readonly songArtistService: SongArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Add an artist to a song' })
  @ApiResponse({ status: 201, description: 'Artist added to song' })
  create(@Body() createSongArtistDto: CreateSongArtistDto) {
    return this.songArtistService.create(createSongArtistDto);
  }

  @Get('song/:songId')
  @ApiOperation({ summary: 'Get all artists for a song' })
  @ApiResponse({ status: 200, description: 'Song artists found' })
  @ApiParam({ name: 'songId', type: 'string' })
  findBySong(@Param('songId') songId: string) {
    return this.songArtistService.findBySong(songId);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get all songs for an artist' })
  @ApiResponse({ status: 200, description: 'Artist songs found' })
  @ApiParam({ name: 'artistId', type: 'string' })
  findByArtist(@Param('artistId') artistId: string) {
    return this.songArtistService.findByArtist(artistId);
  }

  @Patch(':songId/:artistId/role')
  @ApiOperation({ summary: 'Update artist role on a song' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiParam({ name: 'songId', type: 'string' })
  @ApiParam({ name: 'artistId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: ['PRIMARY', 'FEATURED', 'COMPOSER', 'PRODUCER'],
        },
      },
    },
  })
  updateRole(
    @Param('songId') songId: string,
    @Param('artistId') artistId: string,
    @Body('role') role: ArtistRole,
  ) {
    return this.songArtistService.updateRole(songId, artistId, role);
  }

  @Delete(':songId/:artistId')
  @ApiOperation({ summary: 'Remove artist from song' })
  @ApiResponse({ status: 200, description: 'Artist removed from song' })
  @ApiParam({ name: 'songId', type: 'string' })
  @ApiParam({ name: 'artistId', type: 'string' })
  remove(@Param('songId') songId: string, @Param('artistId') artistId: string) {
    return this.songArtistService.remove(songId, artistId);
  }
}

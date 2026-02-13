import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SongGenreService } from '../service/song-genre.service';
import { CreateSongGenreDto } from '../model/dto/SongGenre/create-song-genre.dto';

@ApiBearerAuth()
@Controller('song-genre')
@ApiTags('SongGenre')
export class SongGenreController {
  constructor(private readonly songGenreService: SongGenreService) {}

  @Post()
  @ApiOperation({ summary: 'Add a genre to a song' })
  @ApiResponse({ status: 201, description: 'Genre added to song' })
  create(@Body() createSongGenreDto: CreateSongGenreDto) {
    return this.songGenreService.create(createSongGenreDto);
  }

  @Get('song/:songId')
  @ApiOperation({ summary: 'Get all genres for a song' })
  @ApiResponse({ status: 200, description: 'Song genres found' })
  @ApiParam({ name: 'songId', type: 'string' })
  findBySong(@Param('songId') songId: string) {
    return this.songGenreService.findBySong(songId);
  }

  @Get('genre/:genreId')
  @ApiOperation({ summary: 'Get all songs in a genre' })
  @ApiResponse({ status: 200, description: 'Genre songs found' })
  @ApiParam({ name: 'genreId', type: 'string' })
  findByGenre(@Param('genreId') genreId: string) {
    return this.songGenreService.findByGenre(genreId);
  }

  @Delete(':songId/:genreId')
  @ApiOperation({ summary: 'Remove genre from song' })
  @ApiResponse({ status: 200, description: 'Genre removed from song' })
  @ApiParam({ name: 'songId', type: 'string' })
  @ApiParam({ name: 'genreId', type: 'string' })
  remove(@Param('songId') songId: string, @Param('genreId') genreId: string) {
    return this.songGenreService.remove(songId, genreId);
  }
}

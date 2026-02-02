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
  // ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GenreService } from '../service/genre.service';
import { CreateGenreDto } from '../model/dto/Genre/create-genre.dto';
import { UpdateGenreDto } from '../model/dto/Genre/update-genre.dto';

@Controller('genre')
// @ApiBearerAuth()
@ApiTags('Genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a genre' })
  @ApiResponse({ status: 201, description: 'Genre created' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all genres' })
  @ApiResponse({ status: 200, description: 'Genres found' })
  findAll() {
    return this.genreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a genre by ID' })
  @ApiResponse({ status: 200, description: 'Genre found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a genre by ID' })
  @ApiResponse({ status: 200, description: 'Genre updated' })
  @ApiParam({ name: 'id', type: 'string' })
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre by ID' })
  @ApiResponse({ status: 200, description: 'Genre deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.genreService.remove(id);
  }
}

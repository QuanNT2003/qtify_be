import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArtistService } from '../service/artist.service';
import { CreateArtistDto } from '../model/dto/create-artist.dto';
import { UpdateArtistDto } from '../model/dto/update-artist.dto';

@Controller('artist')
@ApiTags('Artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Create an artist' })
  @ApiResponse({ status: 201, description: 'Artist created' })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all artists' })
  @ApiResponse({ status: 200, description: 'Artists found' })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an artist by ID' })
  @ApiResponse({ status: 200, description: 'Artist found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an artist by ID' })
  @ApiResponse({ status: 200, description: 'Artist updated' })
  @ApiParam({ name: 'id', type: 'string' })
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artist by ID' })
  @ApiResponse({ status: 200, description: 'Artist deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}

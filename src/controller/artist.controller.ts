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
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { ArtistService } from '../service/artist.service';
import { CreateArtistDto } from '../model/dto/Artist/create-artist.dto';
import { UpdateArtistDto } from '../model/dto/Artist/update-artist.dto';
import { GetArtistsDto } from '../model/dto/Artist/get-artists.dto';

@ApiBearerAuth()
@Controller('artist')
@ApiTags('Artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Create an artist with optional avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        bio: { type: 'string' },
        verified: { type: 'boolean' },
        avatar_url: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: 201, description: 'Artist created' })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.artistService.create(createArtistDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Find all artists with pagination' })
  @ApiResponse({ status: 200, description: 'Artists found' })
  findAll(@Query() query: GetArtistsDto) {
    return this.artistService.findAll(query);
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        bio: { type: 'string' },
        verified: { type: 'boolean' },
        avatar_url: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Artist updated' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.artistService.update(id, updateArtistDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artist by ID' })
  @ApiResponse({ status: 200, description: 'Artist deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }

  @Post(':id/avatar')
  @ApiOperation({ summary: 'Upload artist avatar' })
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
  @ApiResponse({ status: 200, description: 'Avatar uploaded' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.artistService.uploadAvatar(id, file);
  }
}

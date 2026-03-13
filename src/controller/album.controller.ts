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
  Req,
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
  ApiQuery,
} from '@nestjs/swagger';
import { AlbumService } from '../service/album.service';
import { CreateAlbumDto } from '../model/dto/Album/create-album.dto';
import { UpdateAlbumDto } from '../model/dto/Album/update-album.dto';
import { GetAlbumsDto } from '../model/dto/Album/get-albums.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/model/enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { OptionalAuth } from 'src/common/decorator/optional-auth.decorator';
import { Request } from 'express';

interface OptionalAuthRequest extends Request {
  user?: { id: string };
}

@ApiBearerAuth()
@Controller('album')
@ApiTags('Album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
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
  @Public()
  @ApiOperation({
    summary: 'Find all albums with pagination and optional title search',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Search album by title',
  })
  @ApiResponse({ status: 200, description: 'Albums found' })
  findAll(@Query() query: GetAlbumsDto) {
    return this.albumService.findAll(query);
  }

  @Get(':id')
  @OptionalAuth()
  @ApiOperation({
    summary:
      'Find an album by ID (includes is_liked for songs if authenticated)',
  })
  @ApiResponse({ status: 200, description: 'Album found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string, @Req() req: OptionalAuthRequest) {
    return this.albumService.findOneDetail(id, req.user?.id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an album by ID' })
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
    },
  })
  @ApiResponse({ status: 200, description: 'Album updated' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.albumService.update(id, updateAlbumDto, file);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
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

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
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../model/dto/User/create-user.dto';
import { UpdateUserDto } from '../model/dto/User/update-user.dto';
import { PageOptionsDto } from '../common/dto/pagination-query.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user with optional avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password_hash: { type: 'string' },
        subscription_type: { type: 'string', enum: ['FREE', 'PREMIUM'] },
        avatar_url: { type: 'string' },
        full_name: { type: 'string' },
        date_of_birth: { type: 'string', format: 'date' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['username', 'email', 'password_hash'],
    },
  })
  @ApiResponse({ status: 201, description: 'User created' })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.create(createUserDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Users found' })
  findAll(@Query() pageOptions: PageOptionsDto) {
    return this.userService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password_hash: { type: 'string' },
        subscription_type: { type: 'string', enum: ['FREE', 'PREMIUM'] },
        avatar_url: { type: 'string' },
        full_name: { type: 'string' },
        date_of_birth: { type: 'string', format: 'date' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.update(id, updateUserDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
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
    return this.userService.uploadAvatar(id, file);
  }
}

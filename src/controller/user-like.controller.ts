import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserLikeService } from '../service/user-like.service';
import { CreateUserLikeDto } from '../model/dto/UserLike/create-user-like.dto';

@ApiBearerAuth()
@Controller('user-like')
@ApiTags('UserLike')
export class UserLikeController {
  constructor(private readonly userLikeService: UserLikeService) {}

  @Post()
  @ApiOperation({ summary: 'Like a song' })
  @ApiResponse({ status: 201, description: 'Song liked' })
  create(@Body() createUserLikeDto: CreateUserLikeDto) {
    return this.userLikeService.create(createUserLikeDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Get user's liked songs" })
  @ApiResponse({ status: 200, description: 'Liked songs found' })
  @ApiParam({ name: 'userId', type: 'string' })
  findByUser(@Param('userId') userId: string) {
    return this.userLikeService.findByUser(userId);
  }

  @Get('song/:songId')
  @ApiOperation({ summary: 'Get users who liked a song' })
  @ApiResponse({ status: 200, description: 'Song likes found' })
  @ApiParam({ name: 'songId', type: 'string' })
  findBySong(@Param('songId') songId: string) {
    return this.userLikeService.findBySong(songId);
  }

  @Delete(':userId/:songId')
  @ApiOperation({ summary: 'Unlike a song' })
  @ApiResponse({ status: 200, description: 'Song unliked' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiParam({ name: 'songId', type: 'string' })
  remove(@Param('userId') userId: string, @Param('songId') songId: string) {
    return this.userLikeService.remove(userId, songId);
  }
}

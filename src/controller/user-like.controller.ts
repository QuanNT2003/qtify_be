import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserLikeService } from '../service/user-like.service';
import { CreateUserLikeDto } from '../model/dto/UserLike/create-user-like.dto';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: { id: string };
}

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

  @Get('me')
  @ApiOperation({
    summary:
      'Get current user liked songs (includes is_liked: true on each song)',
  })
  @ApiResponse({ status: 200, description: 'Liked songs found' })
  findMyLikes(@Req() req: AuthRequest) {
    return this.userLikeService.findByUser(req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Get user's liked songs by userId" })
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

  @Delete('me/:songId')
  @ApiOperation({ summary: 'Unlike a song (authenticated user)' })
  @ApiResponse({ status: 200, description: 'Song unliked' })
  @ApiParam({ name: 'songId', type: 'string' })
  removeMy(@Param('songId') songId: string, @Req() req: AuthRequest) {
    return this.userLikeService.remove(req.user.id, songId);
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

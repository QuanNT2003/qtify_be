import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FollowService } from '../service/follow.service';
import { CreateFollowDto } from '../model/dto/Follow/create-follow.dto';
import { FollowType } from 'src/model/entity/follow.entity';
import { PageOptionsDto } from '../common/dto/pagination-query.dto';

@Controller('follow')
@ApiTags('Follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a follow relationship' })
  @ApiResponse({ status: 201, description: 'Follow created' })
  create(@Body() createFollowDto: CreateFollowDto) {
    return this.followService.create(createFollowDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all follows with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Follows found' })
  findAll(@Query() pageOptions: PageOptionsDto) {
    return this.followService.findAll(pageOptions);
  }

  @Get('followers/:id')
  @ApiOperation({ summary: 'Find all followers of an entity' })
  @ApiResponse({ status: 200, description: 'Followers found' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'type', enum: FollowType })
  findFollowers(@Param('id') id: string, @Query('type') type: FollowType) {
    return this.followService.findFollowers(id, type);
  }

  @Get('following/:id')
  @ApiOperation({ summary: 'Find all entities a user follows' })
  @ApiResponse({ status: 200, description: 'Following found' })
  @ApiParam({ name: 'id', type: 'string' })
  findFollowing(@Param('id') id: string) {
    return this.followService.findFollowing(id);
  }

  @Delete(':followerId/:followedId/:type')
  @ApiOperation({ summary: 'Unfollow an entity' })
  @ApiResponse({ status: 200, description: 'Unfollowed' })
  @ApiParam({ name: 'followerId', type: 'string' })
  @ApiParam({ name: 'followedId', type: 'string' })
  @ApiParam({ name: 'type', enum: FollowType })
  remove(
    @Param('followerId') followerId: string,
    @Param('followedId') followedId: string,
    @Param('type') type: FollowType,
  ) {
    return this.followService.remove(followerId, followedId, type);
  }
}

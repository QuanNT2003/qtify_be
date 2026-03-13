import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ListeningHistoryService } from '../service/listening-history.service';
import { CreateListeningHistoryDto } from '../model/dto/ListeningHistory/create-listening-history.dto';
import { PageOptionsDto } from '../common/dto/pagination-query.dto';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: { id: string };
}

@ApiBearerAuth()
@Controller('listening-history')
@ApiTags('ListeningHistory')
export class ListeningHistoryController {
  constructor(
    private readonly listeningHistoryService: ListeningHistoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Record a listening event' })
  @ApiResponse({ status: 201, description: 'Listening history created' })
  create(@Body() createListeningHistoryDto: CreateListeningHistoryDto) {
    return this.listeningHistoryService.create(createListeningHistoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all listening history with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listening history found' })
  findAll(@Query() pageOptions: PageOptionsDto) {
    return this.listeningHistoryService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find listening history by ID' })
  @ApiResponse({ status: 200, description: 'Listening history found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.listeningHistoryService.findOne(id);
  }

  @Get('user/me')
  @ApiOperation({
    summary:
      "Get current user's listening history (includes is_liked for songs)",
  })
  @ApiResponse({ status: 200, description: 'User listening history found' })
  findMyHistory(@Req() req: AuthRequest) {
    return this.listeningHistoryService.findByUser(req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Get user's listening history by userId" })
  @ApiResponse({ status: 200, description: 'User listening history found' })
  @ApiParam({ name: 'userId', type: 'string' })
  findByUser(@Param('userId') userId: string) {
    return this.listeningHistoryService.findByUser(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete listening history entry' })
  @ApiResponse({ status: 200, description: 'Listening history deleted' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.listeningHistoryService.remove(id);
  }
}

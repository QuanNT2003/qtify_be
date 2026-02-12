import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListeningHistoryService } from '../service/listening-history.service';
import { CreateListeningHistoryDto } from '../model/dto/ListeningHistory/create-listening-history.dto';

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
  @ApiOperation({ summary: 'Find all listening history' })
  @ApiResponse({ status: 200, description: 'Listening history found' })
  findAll() {
    return this.listeningHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find listening history by ID' })
  @ApiResponse({ status: 200, description: 'Listening history found' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.listeningHistoryService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Get user's listening history" })
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

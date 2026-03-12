import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GenerateQueueDto } from '../model/dto/Queue/generate-queue.dto';
import { UpdateCurrentSongDto } from '../model/dto/Queue/update-current-song.dto';
import { QueueService } from '../service/queue.service';
import { ApiBearerAuth } from '@nestjs/swagger';

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}
@ApiBearerAuth()
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('generate')
  async generateQueue(@Req() req: AuthRequest, @Body() body: GenerateQueueDto) {
    return await this.queueService.generateQueue(
      req.user.id,
      body.type,
      body.id,
    );
  }

  @Get()
  async getQueue(@Req() req: AuthRequest) {
    return await this.queueService.getQueue(req.user.id);
  }

  @Patch('current')
  async updateCurrentSong(
    @Req() req: AuthRequest,
    @Body() body: UpdateCurrentSongDto,
  ) {
    return await this.queueService.updateCurrentSong(req.user.id, body.song_id);
  }

  @Delete()
  async deleteQueue(@Req() req: AuthRequest) {
    return await this.queueService.deleteQueue(req.user.id);
  }
}

import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum QueueSourceType {
  ALBUM = 'album',
  ARTIST = 'artist',
  PLAYLIST = 'playlist',
  RANDOM = 'random',
}

export class GenerateQueueDto {
  @ApiProperty({
    example: 'album',
    enum: QueueSourceType,
    description: 'The source type to generate the queue from',
  })
  @IsEnum(QueueSourceType)
  type: QueueSourceType;

  @ApiProperty({
    example: 'uuid-here',
    description: 'The ID of the source (album, artist, or playlist)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;
}

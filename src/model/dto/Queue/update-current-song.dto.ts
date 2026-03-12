import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrentSongDto {
  @ApiProperty({
    example: 'uuid-here',
    description: 'The ID of the song to set as currently playing',
  })
  @IsUUID()
  song_id: string;
}

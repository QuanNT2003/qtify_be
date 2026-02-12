import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongGenreDto {
  @ApiProperty({ example: 'uuid-here', description: 'Song ID' })
  @IsUUID()
  song_id: string;

  @ApiProperty({ example: 'uuid-here', description: 'Genre ID' })
  @IsUUID()
  genre_id: string;
}

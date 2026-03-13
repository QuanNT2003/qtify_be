import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistSongDto {
  @ApiProperty({ example: 'uuid-here', description: 'Playlist ID' })
  @IsUUID()
  playlist_id: string;

  @ApiProperty({ example: 'uuid-here', description: 'Song ID' })
  @IsUUID()
  song_id: string;
}

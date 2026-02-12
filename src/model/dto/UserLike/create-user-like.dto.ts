import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserLikeDto {
  @ApiProperty({ example: 'uuid-here', description: 'User ID' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'uuid-here', description: 'Song ID' })
  @IsUUID()
  song_id: string;
}

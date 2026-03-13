import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'My Favorite Songs', description: 'Playlist title' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'A collection of my favorite tracks',
    description: 'Playlist description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Is playlist public',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}

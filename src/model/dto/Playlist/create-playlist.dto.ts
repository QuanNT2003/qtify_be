import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'uuid-here', description: 'User ID' })
  @IsUUID()
  user_id: string;

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

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Playlist cover image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_image_url?: string;
}

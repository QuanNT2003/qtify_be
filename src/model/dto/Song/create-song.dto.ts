import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  IsPositive,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty({ example: 'Lac Troi', description: 'Song title' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'uuid-here',
    description: 'Album ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  album_id?: string;

  @ApiProperty({ example: 'uuid-here', description: 'Primary artist ID' })
  @IsUUID()
  artist_id: string;

  @ApiProperty({ example: 240, description: 'Song duration in seconds' })
  @IsInt()
  @IsPositive()
  duration: number;

  @ApiProperty({
    example: 'https://example.com/song.mp3',
    description: 'Audio file URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  file_url?: string;

  @ApiProperty({
    example: 1,
    description: 'Track number in album',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  track_number?: number;

  @ApiProperty({
    example: 'Song lyrics...',
    description: 'Song lyrics',
    required: false,
  })
  @IsOptional()
  @IsString()
  lyrics?: string;

  @ApiProperty({
    example: ['uuid1', 'uuid2'],
    description: 'List of genre IDs',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  genre_ids?: string[];

  @ApiProperty({
    example: ['uuid1', 'uuid2'],
    description: 'List of featured artist IDs',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  artist_ids?: string[];
}

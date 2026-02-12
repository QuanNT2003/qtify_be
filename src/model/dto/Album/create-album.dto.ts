import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AlbumType } from 'src/model/entity/album.entity';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Sky Tour', description: 'Album title' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'uuid-here', description: 'Artist ID' })
  @IsUUID()
  artist_id: string;

  @ApiProperty({ example: '2023-07-01', description: 'Album release date' })
  @IsDateString()
  release_date: Date;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Album cover image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_image_url?: string;

  @ApiProperty({
    example: AlbumType.ALBUM,
    description: 'Album type',
    enum: AlbumType,
    default: AlbumType.ALBUM,
  })
  @IsOptional()
  @IsEnum(AlbumType)
  type?: AlbumType;
}

import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArtistRole } from 'src/model/entity/song-artist.entity';

export class CreateSongArtistDto {
  @ApiProperty({ example: 'uuid-here', description: 'Song ID' })
  @IsUUID()
  song_id: string;

  @ApiProperty({ example: 'uuid-here', description: 'Artist ID' })
  @IsUUID()
  artist_id: string;

  @ApiProperty({
    example: ArtistRole.FEATURED,
    description: 'Artist role',
    enum: ArtistRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(ArtistRole)
  role?: ArtistRole;
}

import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateArtistDto {
  @ApiProperty({ example: 'Son Tung MTP', description: 'Artist name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Vietnamese pop singer', description: 'Artist bio' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Artist avatar URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar_url?: string;

  @ApiProperty({ example: false, description: 'Is artist verified' })
  @IsOptional()
  @Transform(({ value }) => {
    // Chuyển 'true' (string) thành true (boolean)
    // Chuyển 'false' (string) thành false (boolean)
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  verified?: boolean;
}

import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsBoolean()
  verified?: boolean;
}

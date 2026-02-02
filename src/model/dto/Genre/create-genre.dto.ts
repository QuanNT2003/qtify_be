import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ example: 'Pop', description: 'Genre name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Description', description: 'Genre description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

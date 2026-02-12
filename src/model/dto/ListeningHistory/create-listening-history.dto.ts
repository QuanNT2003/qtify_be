import {
  IsUUID,
  IsDateString,
  IsOptional,
  IsInt,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListeningHistoryDto {
  @ApiProperty({ example: 'uuid-here', description: 'User ID' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'uuid-here', description: 'Song ID' })
  @IsUUID()
  song_id: string;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Timestamp when played',
  })
  @IsDateString()
  played_at: Date;

  @ApiProperty({
    example: 180,
    description: 'Listen duration in seconds',
    required: false,
  })
  @IsOptional()
  @IsInt()
  listen_duration?: number;

  @ApiProperty({
    example: 'mobile',
    description: 'Device type',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  device_type?: string;

  @ApiProperty({ example: 'iOS', description: 'Platform', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  platform?: string;
}

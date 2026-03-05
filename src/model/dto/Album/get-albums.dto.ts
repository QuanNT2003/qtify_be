import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/pagination-query.dto';

export class GetAlbumsDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search album by title' })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiPropertyOptional({
    description: 'Filter albums by artist IDs (comma-separated UUIDs)',
    type: [String],
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value,
  )
  @IsArray()
  @IsUUID('all', { each: true })
  readonly artist_ids?: string[];
}

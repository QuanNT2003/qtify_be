import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/pagination-query.dto';

export class GetAlbumsDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search album by title' })
  @IsOptional()
  @IsString()
  readonly title?: string;
}

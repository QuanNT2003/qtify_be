import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/pagination-query.dto';

export class GetGenresDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search genre by name' })
  @IsOptional()
  @IsString()
  readonly name?: string;
}

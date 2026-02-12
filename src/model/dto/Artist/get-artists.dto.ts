import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/pagination-query.dto';

export class GetArtistsDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search artist by name' })
  @IsOptional()
  @IsString()
  readonly name?: string;
}

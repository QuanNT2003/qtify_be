import { PartialType } from '@nestjs/swagger';
import { CreateGenreDto } from './Genre/create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}

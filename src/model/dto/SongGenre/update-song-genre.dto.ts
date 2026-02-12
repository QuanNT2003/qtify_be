import { PartialType } from '@nestjs/swagger';
import { CreateSongGenreDto } from './create-song-genre.dto';

export class UpdateSongGenreDto extends PartialType(CreateSongGenreDto) {}

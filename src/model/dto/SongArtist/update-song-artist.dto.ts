import { PartialType } from '@nestjs/swagger';
import { CreateSongArtistDto } from './create-song-artist.dto';

export class UpdateSongArtistDto extends PartialType(CreateSongArtistDto) {}

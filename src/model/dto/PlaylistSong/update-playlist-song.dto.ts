import { PartialType } from '@nestjs/swagger';
import { CreatePlaylistSongDto } from './create-playlist-song.dto';

export class UpdatePlaylistSongDto extends PartialType(CreatePlaylistSongDto) {}

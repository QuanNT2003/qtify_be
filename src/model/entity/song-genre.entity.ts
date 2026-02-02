import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { Song } from './song.entity';
import { Genre } from './genre.entity';

@Entity('song_genres')
export class SongGenre {
  @PrimaryColumn({ type: 'uuid' })
  song_id: string;

  @PrimaryColumn({ type: 'uuid' })
  genre_id: string;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Song, (song) => song.genres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @ManyToOne(() => Genre, (genre) => genre.song_genres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;
}

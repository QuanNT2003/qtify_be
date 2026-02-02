import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { Song } from './song.entity';
import { Artist } from './artist.entity';

export enum ArtistRole {
  PRIMARY = 'PRIMARY',
  FEATURED = 'FEATURED',
  COMPOSER = 'COMPOSER',
  PRODUCER = 'PRODUCER',
}

@Entity('song_artists')
export class SongArtist {
  @PrimaryColumn({ type: 'uuid' })
  song_id: string;

  @PrimaryColumn({ type: 'uuid' })
  artist_id: string;

  @Column({
    type: 'enum',
    enum: ArtistRole,
    default: ArtistRole.FEATURED,
  })
  role: ArtistRole;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Song, (song) => song.featured_artists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @ManyToOne(() => Artist, (artist) => artist.featured_songs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}

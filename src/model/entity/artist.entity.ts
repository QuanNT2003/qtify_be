import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Album } from './album.entity';
import { Song } from './song.entity';
import { SongArtist } from './song-artist.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];

  @OneToMany(() => SongArtist, (songArtist) => songArtist.artist)
  featured_songs: SongArtist[];

  // Note: 'followers' relationship removed because Follow entity no longer has
  // a DB-level FK to Artist (polymorphic relationship handled at app level).
}

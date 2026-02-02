import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Song } from './song.entity';

export enum AlbumType {
  SINGLE = 'SINGLE',
  ALBUM = 'ALBUM',
  EP = 'EP',
}

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'uuid' })
  @Index()
  artist_id: string;

  @Column({ type: 'date' })
  release_date: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cover_image_url: string;

  @Column({
    type: 'enum',
    enum: AlbumType,
    default: AlbumType.ALBUM,
  })
  type: AlbumType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @OneToMany(() => Song, (song) => song.album)
  songs: Song[];
}

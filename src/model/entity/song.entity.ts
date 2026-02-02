import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { SongArtist } from './song-artist.entity';
import { SongGenre } from './song-genre.entity';
import { PlaylistSong } from './playlist-song.entity';
import { UserLike } from './user-like.entity';
import { ListeningHistory } from './listening-history.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'uuid', nullable: true })
  album_id: string;

  @Column({ type: 'uuid' })
  artist_id: string;

  @Column({ type: 'int' })
  duration: number; // duration in seconds

  @Column({ type: 'varchar', length: 500 })
  file_url: string; // URL to audio file in cloud storage

  @Column({ type: 'int', nullable: true })
  track_number: number; // position in album

  @Column({ type: 'text', nullable: true })
  lyrics: string;

  @Column({ type: 'bigint', default: 0 })
  play_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Album, (album) => album.songs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @ManyToOne(() => Artist, (artist) => artist.songs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @OneToMany(() => SongArtist, (songArtist) => songArtist.song)
  featured_artists: SongArtist[];

  @OneToMany(() => SongGenre, (songGenre) => songGenre.song)
  genres: SongGenre[];

  @OneToMany(() => PlaylistSong, (playlistSong) => playlistSong.song)
  playlists: PlaylistSong[];

  @OneToMany(() => UserLike, (userLike) => userLike.song)
  likes: UserLike[];

  @OneToMany(() => ListeningHistory, (history) => history.song)
  listening_history: ListeningHistory[];
}

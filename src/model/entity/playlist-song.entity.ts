import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Song } from './song.entity';

@Entity('playlist_songs')
export class PlaylistSong {
  @PrimaryColumn({ type: 'uuid' })
  playlist_id: string;

  @PrimaryColumn({ type: 'uuid' })
  song_id: string;

  @Column({ type: 'int', default: 0 })
  order_index: number; // Order of song in playlist

  @CreateDateColumn()
  added_at: Date;

  // Relationships
  @ManyToOne(() => Playlist, (playlist) => playlist.songs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @ManyToOne(() => Song, (song) => song.playlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'song_id' })
  song: Song;
}

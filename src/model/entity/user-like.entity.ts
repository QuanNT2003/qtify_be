import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Song } from './song.entity';

@Entity('user_likes')
export class UserLike {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  song_id: string;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.liked_songs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Song, (song) => song.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'song_id' })
  song: Song;
}

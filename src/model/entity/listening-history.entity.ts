import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Song } from './song.entity';

@Entity('listening_history')
export class ListeningHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  song_id: string;

  @Column({ type: 'timestamp' })
  played_at: Date;

  @Column({ type: 'int', nullable: true })
  listen_duration: number; // Duration listened in seconds (to determine if it counts as a play)

  @Column({ type: 'varchar', length: 100, nullable: true })
  device_type: string; // web, mobile, desktop

  @Column({ type: 'varchar', length: 100, nullable: true })
  platform: string; // iOS, Android, Windows, macOS, Web

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.listening_history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Song, (song) => song.listening_history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id' })
  song: Song;
}

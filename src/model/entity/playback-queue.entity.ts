import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('playback_queues')
export class PlaybackQueue {
  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ type: 'json' })
  song_ids: string[]; // Store ordered array of song UUIDs

  @Column({ type: 'uuid', nullable: true })
  current_song_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.playback_queue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

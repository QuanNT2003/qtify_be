import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum FollowType {
  ARTIST = 'ARTIST',
  USER = 'USER',
}

@Entity('follows')
export class Follow {
  @PrimaryColumn({ type: 'uuid' })
  follower_id: string;

  @PrimaryColumn({ type: 'uuid' })
  followed_id: string;

  @PrimaryColumn({
    type: 'enum',
    enum: FollowType,
  })
  type: FollowType;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower_user: User;

  // Note: followed_user and followed_artist relationships removed to avoid
  // duplicate FK constraint on followed_id. Use the 'type' field to determine
  // whether followed_id references a User or Artist, and query accordingly.
}

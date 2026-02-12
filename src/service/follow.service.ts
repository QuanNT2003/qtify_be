import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFollowDto } from '../model/dto/Follow/create-follow.dto';
import { Follow, FollowType } from 'src/model/entity/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async create(createFollowDto: CreateFollowDto) {
    const follow = this.followRepository.create(createFollowDto);
    return this.followRepository.save(follow);
  }

  findAll() {
    return this.followRepository.find();
  }

  findFollowers(followedId: string, type: FollowType) {
    return this.followRepository.find({
      where: { followed_id: followedId, type },
    });
  }

  findFollowing(followerId: string) {
    return this.followRepository.find({
      where: { follower_id: followerId },
    });
  }

  async remove(followerId: string, followedId: string, type: FollowType) {
    const follow = await this.followRepository.findOne({
      where: { follower_id: followerId, followed_id: followedId, type },
    });
    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }
    return this.followRepository.remove(follow);
  }
}

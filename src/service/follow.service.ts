import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFollowDto } from '../model/dto/Follow/create-follow.dto';
import { Follow, FollowType } from 'src/model/entity/follow.entity';
import { PageOptionsDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

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

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResult<Follow>> {
    const [data, total] = await this.followRepository.findAndCount({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.per_page,
    });

    const total_page = Math.ceil(total / pageOptionsDto.per_page);

    return {
      data,
      pagination: {
        page: pageOptionsDto.page,
        per_page: pageOptionsDto.per_page,
        total,
        total_page,
      },
    };
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

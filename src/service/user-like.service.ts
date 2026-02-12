import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserLikeDto } from '../model/dto/UserLike/create-user-like.dto';
import { UserLike } from 'src/model/entity/user-like.entity';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectRepository(UserLike)
    private userLikeRepository: Repository<UserLike>,
  ) {}

  async create(createUserLikeDto: CreateUserLikeDto) {
    const userLike = this.userLikeRepository.create(createUserLikeDto);
    return this.userLikeRepository.save(userLike);
  }

  findByUser(userId: string) {
    return this.userLikeRepository.find({
      where: { user_id: userId },
    });
  }

  findBySong(songId: string) {
    return this.userLikeRepository.find({
      where: { song_id: songId },
    });
  }

  async remove(userId: string, songId: string) {
    const userLike = await this.userLikeRepository.findOne({
      where: { user_id: userId, song_id: songId },
    });
    if (!userLike) {
      throw new NotFoundException('Like not found');
    }
    return this.userLikeRepository.remove(userLike);
  }
}

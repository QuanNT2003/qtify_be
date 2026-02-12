import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../model/dto/User/create-user.dto';
import { UpdateUserDto } from '../model/dto/User/update-user.dto';
import { User } from 'src/model/entity/user.entity';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const user = this.userRepository.create(createUserDto);

    // Upload avatar if file is provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'users',
      );
      user.avatar_url = uploadResult.secure_url;
    }

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatar_url) {
      await this.cloudinaryService.deleteFile(user.avatar_url, 'image');
    }

    return this.userRepository.remove(user);
  }

  async uploadAvatar(id: string, file: Express.Multer.File) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'users',
    );

    user.avatar_url = uploadResult.secure_url;
    return this.userRepository.save(user);
  }
}

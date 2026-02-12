import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateListeningHistoryDto } from '../model/dto/ListeningHistory/create-listening-history.dto';
import { ListeningHistory } from 'src/model/entity/listening-history.entity';

@Injectable()
export class ListeningHistoryService {
  constructor(
    @InjectRepository(ListeningHistory)
    private listeningHistoryRepository: Repository<ListeningHistory>,
  ) {}

  async create(createListeningHistoryDto: CreateListeningHistoryDto) {
    const history = this.listeningHistoryRepository.create(
      createListeningHistoryDto,
    );
    return this.listeningHistoryRepository.save(history);
  }

  findAll() {
    return this.listeningHistoryRepository.find();
  }

  findOne(id: string) {
    return this.listeningHistoryRepository.findOne({ where: { id } });
  }

  findByUser(userId: string) {
    return this.listeningHistoryRepository.find({
      where: { user_id: userId },
      order: { played_at: 'DESC' },
    });
  }

  findByUserAndDateRange(userId: string, startDate: Date, endDate: Date) {
    return this.listeningHistoryRepository.find({
      where: {
        user_id: userId,
        played_at: Between(startDate, endDate),
      },
      order: { played_at: 'DESC' },
    });
  }

  async remove(id: string) {
    const history = await this.findOne(id);
    if (!history) {
      throw new NotFoundException('Listening history not found');
    }
    return this.listeningHistoryRepository.remove(history);
  }
}

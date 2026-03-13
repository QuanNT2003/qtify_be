import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePlaylistDto } from '../model/dto/Playlist/create-playlist.dto';
import { UpdatePlaylistDto } from '../model/dto/Playlist/update-playlist.dto';
import { Playlist } from 'src/model/entity/playlist.entity';
import { PageOptionsDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { UserLike } from 'src/model/entity/user-like.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(UserLike)
    private userLikeRepository: Repository<UserLike>,
  ) {}

  async create(userId: string, createPlaylistDto: CreatePlaylistDto) {
    const playlist = this.playlistRepository.create({
      ...createPlaylistDto,
      user_id: userId,
    });

    return this.playlistRepository.save(playlist);
  }

  async findAll(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResult<Playlist>> {
    const [data, total] = await this.playlistRepository.findAndCount({
      where: [{ user_id: userId }, { is_public: true }],
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

  async findOne(id: string, userId?: string) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['songs', 'songs.song', 'songs.song.artist'],
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (userId && playlist.user_id !== userId && !playlist.is_public) {
      throw new NotFoundException('Playlist not found');
    }

    // Attach is_liked for each song in the playlist
    if (userId && playlist.songs && playlist.songs.length > 0) {
      const songIds = playlist.songs
        .map((ps) => ps.song?.id)
        .filter((id): id is string => !!id);

      if (songIds.length > 0) {
        const likes = await this.userLikeRepository.find({
          where: { user_id: userId, song_id: In(songIds) },
        });
        const likedSongIds = new Set(likes.map((l) => l.song_id));
        playlist.songs.forEach((ps) => {
          if (ps.song) {
            Object.assign(ps.song, { is_liked: likedSongIds.has(ps.song.id) });
          }
        });
      }
    }

    return playlist;
  }

  async update(
    id: string,
    userId: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const playlist = await this.findOne(id, userId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.user_id !== userId) {
      throw new NotFoundException(
        'You do not have permission to update this playlist',
      );
    }

    Object.assign(playlist, updatePlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async remove(id: string, userId: string) {
    const playlist = await this.findOne(id, userId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.user_id !== userId) {
      throw new NotFoundException(
        'You do not have permission to delete this playlist',
      );
    }

    return this.playlistRepository.remove(playlist);
  }
}

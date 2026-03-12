import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PlaybackQueue } from '../model/entity/playback-queue.entity';
import { Song } from '../model/entity/song.entity';
import { Album } from '../model/entity/album.entity';
import { Artist } from '../model/entity/artist.entity';
import { Playlist } from '../model/entity/playlist.entity';
import { QueueSourceType } from '../model/dto/Queue/generate-queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(PlaybackQueue)
    private readonly queueRepository: Repository<PlaybackQueue>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async generateQueue(userId: string, type: QueueSourceType, id?: string) {
    let sourceSongs: Song[] = [];
    const TARGET_QUEUE_SIZE = 30;

    switch (type) {
      case QueueSourceType.ALBUM: {
        if (!id) throw new NotFoundException('Album ID is required');
        sourceSongs = await this.songRepository.find({
          where: { album_id: id },
        });
        break;
      }
      case QueueSourceType.ARTIST: {
        if (!id) throw new NotFoundException('Artist ID is required');
        const artist = await this.artistRepository.findOne({
          where: { id },
          relations: ['songs'],
        });
        if (artist && artist.songs) {
          sourceSongs = artist.songs;
        }
        break;
      }
      case QueueSourceType.PLAYLIST: {
        if (!id) throw new NotFoundException('Playlist ID is required');
        const playlist = await this.playlistRepository.findOne({
          where: { id },
          relations: ['songs', 'songs.song'],
        });
        if (playlist && playlist.songs) {
          sourceSongs = playlist.songs.map((ps) => ps.song);
        }
        break;
      }
      case QueueSourceType.RANDOM:
        break; // Will just fetch random songs below
    }

    // Shuffle the source songs to randomize play order
    const songIds: string[] = this.shuffleArray(sourceSongs.map((s) => s.id));

    // Fill up the queue with random songs if we haven't reached the target size
    if (songIds.length < TARGET_QUEUE_SIZE) {
      const remainingSlots = TARGET_QUEUE_SIZE - songIds.length;

      const randomSongs = await this.songRepository
        .createQueryBuilder('song')
        .orderBy('RAND()')
        .limit(remainingSlots + 10) // fetch extra to account for duplicates
        .getMany();

      for (const randSong of randomSongs) {
        if (songIds.length >= TARGET_QUEUE_SIZE) break;
        if (!songIds.includes(randSong.id)) {
          songIds.push(randSong.id);
        }
      }
    }

    if (songIds.length === 0) {
      throw new NotFoundException(
        'Could not generate queue: no eligible songs found.',
      );
    }

    // Upsert the queue for the user
    let queue = await this.queueRepository.findOne({
      where: { user_id: userId },
    });
    if (!queue) {
      queue = this.queueRepository.create({
        user_id: userId,
        song_ids: songIds,
        current_song_id: songIds[0],
      });
    } else {
      queue.song_ids = songIds;
      queue.current_song_id = songIds[0];
    }

    return this.queueRepository.save(queue);
  }

  async getQueue(userId: string) {
    const queue = await this.queueRepository.findOne({
      where: { user_id: userId },
    });
    if (!queue) {
      return null;
    }

    // Fetch full song objects for the IDs in the queue
    const songs = await this.songRepository.findBy({ id: In(queue.song_ids) });

    // Re-order the songs to match the array order since findByIds doesn't guarantee order
    const songMap = new Map(songs.map((song) => [song.id, song]));
    const orderedSongs = queue.song_ids
      .map((id) => songMap.get(id))
      .filter((song) => song !== undefined); // Remove nulls if a song was deleted

    return {
      ...queue,
      songs: orderedSongs,
    };
  }

  async updateCurrentSong(userId: string, songId: string) {
    const queue = await this.queueRepository.findOne({
      where: { user_id: userId },
    });
    if (!queue) {
      throw new NotFoundException('No active queue found');
    }

    if (!queue.song_ids.includes(songId)) {
      throw new NotFoundException('Song is not in the current queue');
    }

    queue.current_song_id = songId;
    return this.queueRepository.save(queue);
  }

  async deleteQueue(userId: string) {
    return this.queueRepository.delete({ user_id: userId });
  }
}

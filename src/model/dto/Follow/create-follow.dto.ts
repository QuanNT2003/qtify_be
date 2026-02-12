import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FollowType } from 'src/model/entity/follow.entity';

export class CreateFollowDto {
  @ApiProperty({ example: 'uuid-here', description: 'Follower user ID' })
  @IsUUID()
  follower_id: string;

  @ApiProperty({
    example: 'uuid-here',
    description: 'Followed entity ID (User or Artist)',
  })
  @IsUUID()
  followed_id: string;

  @ApiProperty({
    example: FollowType.ARTIST,
    description: 'Type of followed entity',
    enum: FollowType,
  })
  @IsEnum(FollowType)
  type: FollowType;
}

import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from 'src/model/entity/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsString()
  @MaxLength(100)
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password_hash: string;

  @ApiProperty({
    example: SubscriptionType.FREE,
    description: 'Subscription type',
    enum: SubscriptionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(SubscriptionType)
  subscription_type?: SubscriptionType;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar_url?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  full_name?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;
}

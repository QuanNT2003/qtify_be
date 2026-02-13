import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../model/entity/user.entity';
import { RegisterDto } from '../model/dto/auth/register.dto';
import { LoginDto } from '../model/dto/auth/login.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmailOrUsername(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }

    const existingUsername = await this.userService.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    // Create user - password will be hashed automatically by entity hook
    const user = await this.userService.create({
      email: registerDto.email,
      username: registerDto.username,
      password: registerDto.password,
      full_name: registerDto.full_name,
    } as any); // Cast as any because userService.create expects CreateUserDto which might have slightly different structure but we are passing valid fields

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    const user = await this.userService.findByEmailOrUsername(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email or username not found');
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    await this.userService.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.userService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

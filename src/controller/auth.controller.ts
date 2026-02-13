import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../model/dto/auth/register.dto';
import { RefreshTokenDto } from '../model/dto/auth/refresh-token.dto';
import { User } from '../model/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../model/dto/auth/login.dto';
import { Public } from '../common/decorator/public.decorator';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { JwtPayload } from '../common/strategies/jwt.strategy';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return { message: 'User registered successfully', user };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const payload = this.jwtService.verify<JwtPayload>(
      refreshTokenDto.refreshToken,
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );
    return this.authService.refreshTokens(
      payload.sub,
      refreshTokenDto.refreshToken,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }
}

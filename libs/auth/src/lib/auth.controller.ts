import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login-auth.dto';
import { CreateUserDto } from '@org/users';
import { UserResponseDto } from 'libs/users/src/lib/dto/response-user.dto';
import { Request } from 'express';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string, hero: any }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    );
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const token = await this.authService.login(user);

    return {
      access_token: token.access_token,
      hero: token.hero,
    };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ message: string; user: UserResponseDto }> {
    const user = await this.authService.register(createUserDto);

    return {
      message: 'User registered successfully',
      user: { email: user.email },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: RequestWithUser): Promise<any> {
    const user = await this.authService.profile(req.user.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

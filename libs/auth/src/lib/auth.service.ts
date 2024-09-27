import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UsersService, HeroService } from '@org/users';
import { LoginDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly heroService: HeroService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (
      user &&
      (await this.usersService.validatePassword(password, user.password))
    ) {
      user.password = password
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user._id };
    const hero = await this.heroService.findByUserId(user.hero);

    return {
      access_token: this.jwtService.sign(payload),
      hero
    };
  }

  async register(createUserDto: CreateUserDto) {

    return await this.usersService.create(createUserDto);
  }

  async profile(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hero = await this.heroService.findByUserId(user.hero);
    return {user, hero};
  }  
}

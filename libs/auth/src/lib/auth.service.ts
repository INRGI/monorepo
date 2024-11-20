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

  /**
   * Validates a user's login credentials.
   *
   * Looks up a user by the given email address, and then checks if the given
   * password matches the user's stored password hash. If both checks pass, the
   * user is returned; otherwise, null is returned.
   * @param email The email address to look up.
   * @param password The password to check against the user's stored hash.
   * @returns The user if the login credentials are valid, otherwise null.
   */
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

  /**
   * Logs in a user given their email and password.
   * @param loginDto contains the email and password of the user to log in.
   * @returns An object containing the access token and the user's hero.
   * @throws NotFoundException if the user is not found or the password is incorrect.
   */
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

  /**
   * Registers a new user.
   * 
   * Creates a new user account with the provided email and password.
   * @param createUserDto The data transfer object containing the user's email and password.
   * @returns A promise that resolves with the newly created user.
   * @throws ConflictException if a user with the same email already exists.
   */
  async register(createUserDto: CreateUserDto) {

    return await this.usersService.create(createUserDto);
  }

  /**
   * Returns a user's profile information.
   * @param email The email of the user to fetch the profile for.
   * @returns A promise that resolves with an object containing the user and their hero.
   * @throws NotFoundException if the user is not found.
   */
  async profile(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hero = await this.heroService.findByUserId(user.hero);
    return {user, hero};
  }  
}

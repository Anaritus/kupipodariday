import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from 'src/hash/hash';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private hash: Hash,
  ) {}
  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser({ username, password }: SigninUserDto) {
    const user = await this.userService.findOne({ username }, null, true);
    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    const matched = await this.hash.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    return user;
  }

  async signupUser(createUserDto: CreateUserDto) {
    if (await this.userService.checkExists(createUserDto)) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    const hash = await this.hash.hash(createUserDto.password);
    const user = await this.userService.create({
      ...createUserDto,
      password: hash,
    });
    return user;
  }
}

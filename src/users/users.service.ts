import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfileResponseDto } from './dto/user-profile-response-dto';
import { UserWishDto } from 'src/wishes/dto/user-wishes-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    UserProfileResponseDto.makeResponse(user);
    return user;
  }

  async findMany(query: string) {
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    users.forEach(UserProfileResponseDto.makeResponse);
    return users;
  }

  async checkExists(createUserDto: CreateUserDto) {
    const users = await this.userRepository.find({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    return !!users.length;
  }

  async findOne(
    options: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
    password: boolean = false,
  ) {
    const user = await this.userRepository.findOne({
      where: options,
      relations,
    });
    if (!user) {
      throw new UnauthorizedException('Данного пользователя не существует');
    }
    if (!password) {
      UserProfileResponseDto.makeResponse(user);
    }
    if (user.wishes) {
      user.wishes.forEach(UserWishDto.makeResponse);
    }
    return user;
  }

  async updateOne(
    options: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    await this.userRepository.update(options, updateUserDto);
    return await this.findOne(options);
  }

  async removeOne(options: FindOptionsWhere<User>) {
    const userToDelete = await this.findOne(options);
    return this.userRepository.delete(userToDelete.id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { UserProfileResponseDto } from './dto/user-profile-response-dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response-dto';
import { FindUsersDto } from './dto/find-users-dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserWishDto } from 'src/wishes/dto/user-wishes-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getUser(
    @Req() req: { user: { id: number } },
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOne({
      id: req.user.id,
    });
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: { id: number } },
  ): Promise<UserProfileResponseDto> {
    return await this.usersService.updateOne(
      { id: req.user.id },
      updateUserDto,
    );
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getUserWishes(@Req() req: { user: { id: number } }): Promise<Wish[]> {
    const user = await this.usersService.findOne(
      { id: req.user.id },
      {
        wishes: { owner: true, offers: { user: true } },
      },
    );
    return user.wishes;
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async getPublicUser(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.usersService.findOne({
      username,
    });
    UserPublicProfileResponseDto.makeResponse(user);
    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async getPublicUserWishes(
    @Param('username') username: string,
  ): Promise<UserWishDto[]> {
    const user = await this.usersService.findOne(
      {
        username,
      },
      { wishes: { offers: { user: true } } },
    );
    return user.wishes;
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findUsers(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserProfileResponseDto[]> {
    return await this.usersService.findMany(findUsersDto.query);
  }
}

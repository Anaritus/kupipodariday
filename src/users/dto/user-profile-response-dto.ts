import { IsEmail, IsUrl, Length } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserProfileResponseDto {
  id: number;

  @Length(1, 64)
  username: string;

  @Length(1, 200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  createdAt: Date;

  updatedAt: Date;

  static makeResponse(user: User) {
    delete user.password;
  }
}

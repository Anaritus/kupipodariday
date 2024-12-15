import { IsUrl, Length } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserPublicProfileResponseDto {
  id: number;

  @Length(1, 64)
  username: string;

  @Length(1, 200)
  about: string;

  @IsUrl()
  avatar: string;

  createdAt: Date;

  updatedAt: Date;

  static makeResponse(user: User) {
    delete user.email;
    delete user.password;
  }
}

import { IsNotEmpty } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

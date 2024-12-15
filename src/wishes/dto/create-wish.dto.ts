import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;
}

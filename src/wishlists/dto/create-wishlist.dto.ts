import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  image: string;

  @IsNotEmpty()
  itemsId: number[];
}

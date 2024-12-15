import { IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  hidden: boolean = false;

  @IsNotEmpty()
  itemId: number;
}

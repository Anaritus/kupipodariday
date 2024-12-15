import { IsNotEmpty } from 'class-validator';
import { CreateWishDto } from './create-wish.dto';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from '../entities/wish.entity';
import { UserPublicProfileResponseDto } from 'src/users/dto/user-public-profile-response-dto';
import { GetOfferDto } from 'src/offers/dto/get-offer.dto';

export class UserWishDto extends CreateWishDto {
  @IsNotEmpty()
  createdAt: Date;
  @IsNotEmpty()
  updatedAt: Date;
  @IsNotEmpty()
  raised: number;
  @IsNotEmpty()
  copied: number;
  @IsNotEmpty()
  offers: Offer[];

  static makeResponse(wish: Wish) {
    if (wish.owner) {
      UserPublicProfileResponseDto.makeResponse(wish.owner);
    }
    if (wish.offers) {
      wish.offers = wish.offers.filter((offer) => !offer.hidden);
      wish.offers.forEach(GetOfferDto.makeResponse);
    }
  }
}

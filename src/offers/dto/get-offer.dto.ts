import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from '../entities/offer.entity';
import { UserPublicProfileResponseDto } from 'src/users/dto/user-public-profile-response-dto';
import { UserWishDto } from 'src/wishes/dto/user-wishes-dto';

export class GetOfferDto {
  CreatedAt: Date;
  UpdatedAt: Date;
  id: number;
  user: User;
  itemId: Wish;
  amount: number;
  hidden: boolean;

  static makeResponse(offer: Offer) {
    if (offer.user) {
      UserPublicProfileResponseDto.makeResponse(offer.user);
    }

    if (offer.item) {
      UserWishDto.makeResponse(offer.item);
    }
  }
}

import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  private defaultOptions: FindOneOptions<Offer> = {
    relations: { item: { owner: true }, user: true },
  };

  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    @Inject() private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  private cleanPrivateFields(offer: Offer) {
    delete offer.item.owner.email;
    delete offer.item.owner.password;
    delete offer.user.password;
    return offer;
  }

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const wish = await this.wishesService.findOne({
      id: createOfferDto.itemId,
    });
    const user = await this.usersService.findOne({ id: userId });
    if (wish.owner.id == user.id) {
      throw new ForbiddenException('На свой подарок скидываться нельзя');
    }
    if (+wish.raised + createOfferDto.amount > wish.price) {
      throw new ForbiddenException(
        'Нельзя скинуть больше чем осталось собрать',
      );
    }
    await this.wishesService.raiseMoney(
      wish.id,
      +wish.raised + createOfferDto.amount,
    );
    return await this.offerRepository.save({ ...createOfferDto, item: wish });
  }

  async findMany(options?: FindManyOptions<Offer>) {
    const offers = await this.offerRepository.find({
      ...this.defaultOptions,
      ...options,
    });

    return offers.map(this.cleanPrivateFields);
  }

  async findOne(options: FindOptionsWhere<Offer>) {
    return this.cleanPrivateFields(
      await this.offerRepository.findOne({
        where: options,
        ...this.defaultOptions,
      }),
    );
  }

  async updateOne(
    options: FindOptionsWhere<Offer>,
    updateUserDto: UpdateOfferDto,
  ) {
    let wishToUpdate = await this.findOne(options);
    wishToUpdate = { ...wishToUpdate, ...updateUserDto };
    return this.offerRepository.save(wishToUpdate);
  }

  async removeOne(options: FindOptionsWhere<Offer>) {
    const userToDelete = await this.findOne(options);
    return this.offerRepository.remove(userToDelete);
  }
}

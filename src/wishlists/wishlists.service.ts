import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { UserPublicProfileResponseDto } from 'src/users/dto/user-public-profile-response-dto';
import { UserWishDto } from 'src/wishes/dto/user-wishes-dto';

@Injectable()
export class WishlistsService {
  private defaultOptions: FindManyOptions<Wishlist> | FindOneOptions<Wishlist> =
    {
      relations: {
        owner: true,
        items: true,
      },
    };
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  static clean(wishlist: Wishlist) {
    UserPublicProfileResponseDto.makeResponse(wishlist.owner);
    wishlist.items.forEach(UserWishDto.makeResponse);
  }

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const owner = await this.usersService.findOne({
      id: userId,
    });

    const items = await this.wishesService.findMany({
      where: createWishlistDto.itemsId.map((item) => ({ id: item })),
    });

    delete createWishlistDto.itemsId;
    const wishlist = await this.wishlistRepository.save({
      ...createWishlistDto,
      owner,
      items,
    });
    WishlistsService.clean(wishlist);
    return wishlist;
  }

  async findMany(options?: FindManyOptions<Wishlist>) {
    try {
      const wishlists = await this.wishlistRepository.find({
        ...this.defaultOptions,
        ...options,
      });

      wishlists.forEach(WishlistsService.clean);
      return wishlists;
    } catch {
      return [];
    }
  }

  async findOne(options: FindOptionsWhere<Wishlist>) {
    const wishlist = await this.wishlistRepository.findOne({
      where: options,
      ...this.defaultOptions,
    });
    WishlistsService.clean(wishlist);
    return wishlist;
  }

  async updateOne(
    options: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    let wishlistToUpdate = await this.findOne(options);
    const user = await this.usersService.findOne({ id: userId });
    if (wishlistToUpdate.owner.id !== user.id) {
      throw new UnauthorizedException('У вас нет прав для данной операции');
    }
    if (updateWishlistDto.itemsId) {
      wishlistToUpdate.items = await this.wishesService.findMany({
        where: updateWishlistDto.itemsId.map((item) => ({ id: item })),
      });
    }
    wishlistToUpdate = { ...wishlistToUpdate, ...updateWishlistDto };
    return this.wishlistRepository.save(wishlistToUpdate);
  }

  async removeOne(options: FindOptionsWhere<Wishlist>, userId: number) {
    const user = await this.usersService.findOne({ id: userId });
    const wishlistToDelete = await this.findOne(options);
    if (user.id !== wishlistToDelete.owner.id) {
      throw new UnauthorizedException('У вас нет прав для данной операции');
    }
    return this.wishlistRepository.delete(wishlistToDelete.id);
  }
}

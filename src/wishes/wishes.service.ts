import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserWishDto } from './dto/user-wishes-dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    @Inject() private usersService: UsersService,
  ) {}

  private defaultOptions: FindManyOptions<Wish> | FindOneOptions<Wish> = {
    relations: { owner: true, offers: { user: true } },
  };

  async create(createWishDto: CreateWishDto, user: User) {
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    UserWishDto.makeResponse(wish);
    return wish;
  }

  async findMany(options?: FindManyOptions<Wish>) {
    const wishes = await this.wishRepository.find({
      ...this.defaultOptions,
      ...options,
    });
    wishes.forEach(UserWishDto.makeResponse);
    return wishes;
  }

  async findOne(
    options: FindOptionsWhere<Wish>,
    extraOptions?: FindOneOptions<Wish>,
  ) {
    const wish = await this.wishRepository.findOne({
      where: options,
      ...this.defaultOptions,
      ...extraOptions,
    });
    if (!wish) {
      throw new NotFoundException('Данной хотелки не существует');
    }
    UserWishDto.makeResponse(wish);
    return wish;
  }

  findPopular() {
    return this.findMany({ order: { copied: 'DESC' }, take: 20 });
  }

  findLast() {
    return this.findMany({ order: { createdAt: 'DESC' }, take: 40 });
  }

  async updateOne(
    options: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    let wishToUpdate = await this.findOne(options);
    const user = await this.usersService.findOne({ id: userId });
    if (wishToUpdate.owner.id !== user.id) {
      throw new UnauthorizedException('У вас нет прав для данной операции');
    }
    if (this.checkOffers(wishToUpdate, updateWishDto)) {
      throw new BadRequestException(
        'Нельзя менять цену при имеющихся предложениях',
      );
    }
    wishToUpdate = { ...wishToUpdate, ...updateWishDto };
    delete wishToUpdate.offers;
    delete wishToUpdate.owner;
    return this.wishRepository.update(wishToUpdate.id, wishToUpdate);
  }

  private checkOffers(wishToUpdate: Wish, updateWishDto: UpdateWishDto) {
    return wishToUpdate.offers.length && updateWishDto.price;
  }

  async removeOne(options: FindOptionsWhere<Wish>, userId: number) {
    const wishToDelete = await this.findOne(options);
    const user = await this.usersService.findOne({ id: userId });
    if (wishToDelete.owner.id !== user.id) {
      throw new UnauthorizedException('У вас нет прав для данной операции');
    }
    return this.wishRepository.delete(wishToDelete.id);
  }

  async raiseMoney(id: number, newRaised: number) {
    return this.wishRepository.update(id, { raised: newRaised });
  }
}

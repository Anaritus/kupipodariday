import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/jwt/jwt.guard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    const wishlists = this.wishlistsService.findMany();
    return wishlists;
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: { user: { id: number } },
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return await this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne({ id });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async patchWishlist(
    @Req() req: { user: { id: number } },
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return await this.wishlistsService.updateOne(
      { id },
      updateWishlistDto,
      req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishlist(
    @Req() req: { user: { id: number } },
    @Param('id') id: number,
  ) {
    return await this.wishlistsService.removeOne({ id }, req.user.id);
  }
}

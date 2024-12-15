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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() req: { user: { id: number } },
  ) {
    const user = await this.usersService.findOne({
      id: req.user.id,
    });
    return await this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findPopular() {
    return this.wishesService.findPopular();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOne({ id });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async patchOne(
    @Param('id') id: number,
    @Req() req: { user: { id: number } },
    @Body() updateWishDto: UpdateWishDto,
  ) {
    try {
      return await this.wishesService.updateOne(
        { id },
        updateWishDto,
        req.user.id,
      );
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(
    @Param('id') id: number,
    @Req() req: { user: { id: number } },
  ) {
    try {
      return await this.wishesService.removeOne({ id }, req.user.id);
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: number, @Req() req: { user: { id: number } }) {
    const user = await this.usersService.findOne({
      id: req.user.id,
    });
    const wish = await this.wishesService.findOne({ id }, { relations: null });
    return this.wishesService.create(wish, user);
  }
}

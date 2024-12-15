import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/jwt/jwt.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: { user: { id: number } },
  ) {
    return await this.offersService.create(createOfferDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.offersService.findMany();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOffer(@Param('id') id: number) {
    return this.offersService.findOne({ id });
  }
}

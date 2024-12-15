import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async singin(@Req() req: { user: User }) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async singup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signupUser(createUserDto);
  }
}

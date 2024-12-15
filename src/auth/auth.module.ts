import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { Hash } from 'src/hash/hash';
import { JwtStrategy } from 'src/jwt-strategy/jwt-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return { secret: configService.get<string>('jwt-secret') };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, Hash, LocalStrategy, ConfigService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

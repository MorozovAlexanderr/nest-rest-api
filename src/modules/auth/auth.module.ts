import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategys/local.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategys/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategys/jwt-refresh-token.strategy';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, JwtModule.register({})],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}

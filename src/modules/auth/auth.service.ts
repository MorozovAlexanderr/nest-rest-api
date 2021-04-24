import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRegisterDto } from './dto/UserRegister.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegistrationStatus } from './interfaces/registretionStatus.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(user: UserRegisterDto): Promise<RegistrationStatus> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.userService.create({
        ...user,
        password: hashedPassword,
      });
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    const isMatchPass = await bcrypt.compare(password, user.password);
    if (user && isMatchPass) {
      return user;
    }
    return null;
  }

  public getJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }

  public getJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }
}

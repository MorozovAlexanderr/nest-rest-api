import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/UserRegister.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { RegistrationStatus } from './interfaces/registretionStatus.interface';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLoginDto } from './dto/UserLogin.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // Test route
  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Post('register')
  @ApiBody({ type: UserRegisterDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
  })
  @ApiResponse({
    status: 404,
    description: 'Registration failed',
  })
  async register(
    @Body() registerData: UserRegisterDto,
  ): Promise<RegistrationStatus> {
    return this.authService.register(registerData);
  }

  @HttpCode(200)
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'User login',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const {
      cookie: refreshTokenCookie,
      token: refreshToken,
    } = this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}

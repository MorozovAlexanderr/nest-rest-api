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
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLoginDto } from './dto/UserLogin.dto';
import { User } from '../users/entities/user.entity';

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

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: UserRegisterDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: [User],
  })
  @ApiResponse({
    status: 404,
    description: 'Registration failed',
  })
  @Post('register')
  async register(
    @Body() registerData: UserRegisterDto,
  ): Promise<RegistrationStatus> {
    return this.authService.register(registerData);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Auth user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken = this.authService.getJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh user token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessToken = this.authService.getJwtAccessToken(request.user.id);
    return { accessToken };
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/role.enum';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserEntity,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [UserDto],
  })
  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'Get user by id',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.usersService.getById(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'Update user by id',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'Delete user by id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

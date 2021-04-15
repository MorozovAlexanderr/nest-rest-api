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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/role.enum';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get user by id',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getById(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Update user by id',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete user by id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

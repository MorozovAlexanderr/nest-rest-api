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
  UseInterceptors,
  CacheInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TodoEntity } from './entities/todo.entity';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Controller('todos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Create todo' })
  @ApiBody({ type: CreateTodoDto })
  @ApiCreatedResponse({
    description: 'Todo has been successfully created.',
    type: TodoEntity,
  })
  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @User() user: UserEntity,
  ): Promise<TodoEntity> {
    return this.todoService.create(createTodoDto, user);
  }

  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({
    status: 200,
    type: [TodoEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @Get()
  findAll(@User() user: UserEntity): Promise<TodoEntity[]> {
    return this.todoService.findAll(user);
  }

  @ApiOperation({ summary: 'Get todo' })
  @ApiResponse({
    status: 200,
    type: TodoEntity,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return this.todoService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update todo' })
  @ApiResponse({
    status: 200,
    type: TodoEntity,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: UserEntity,
  ) {
    return this.todoService.update(id, updateTodoDto, user);
  }

  @ApiOperation({ summary: 'Delete todo' })
  @ApiResponse({
    status: 200,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    return this.todoService.remove(id, request.user);
  }
}

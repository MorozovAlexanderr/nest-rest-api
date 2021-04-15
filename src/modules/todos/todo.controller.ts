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
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';

@Controller('todos')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiBody({ type: CreateTodoDto })
  @ApiCreatedResponse({
    description: 'Todo has been successfully created.',
    type: Todo,
  })
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all todos for current user',
    type: [Todo],
  })
  findAllForUser(@Req() request: RequestWithUser): Promise<Todo[]> {
    return this.todoService.findAllForUser(request.user);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get todo by id',
    type: Todo,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    return this.todoService.findOne(id, request.user);
  }

  @Patch(':id')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Update todo by id',
    type: Todo,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete todo by id',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    return this.todoService.remove(id, request.user);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    return this.todoRepository.save(createTodoDto);
  }

  async findAllForUser(user: User): Promise<Todo[]> {
    return this.todoRepository.find({ user });
  }

  async findOne(id: number, user: User): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ id, user });
    if (todo) {
      return todo;
    }
    throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number, user: User): Promise<void> {
    await this.todoRepository.delete({ id, user });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<void> {
    await this.todoRepository.update(id, updateTodoDto);
  }
}

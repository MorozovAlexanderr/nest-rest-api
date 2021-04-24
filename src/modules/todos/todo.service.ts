import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    return this.todoRepository.save(createTodoDto);
  }

  async findAllForUser(user: UserEntity): Promise<TodoEntity[]> {
    return this.todoRepository.find({ user });
  }

  async findOne(id: number, user: UserEntity): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ id, user });
    if (todo) {
      return todo;
    }
    throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number, user: UserEntity): Promise<void> {
    await this.todoRepository.delete({ id, user });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<void> {
    await this.todoRepository.update(id, updateTodoDto);
  }
}

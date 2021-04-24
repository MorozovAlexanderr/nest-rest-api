import { CacheModule, Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoEntity } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}

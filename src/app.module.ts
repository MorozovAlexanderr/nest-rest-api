import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './modules/todos/todo.module';
import { UsersModule } from './modules/users/users.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { configModule } from './configure.root';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TodoModule,
    UsersModule,
    AuthModule,
    configModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

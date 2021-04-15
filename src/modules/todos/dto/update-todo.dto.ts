import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { IsOptional } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiPropertyOptional()
  @IsOptional()
  title: string;
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Todo } from '../../todos/entities/todo.entity';
import { UserRole } from '../enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @ApiProperty({ enum: ['Admin', 'User'], default: UserRole.User })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;
}

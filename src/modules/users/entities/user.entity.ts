import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TodoEntity } from '../../todos/entities/todo.entity';
import { UserRole } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../../../common/entity/abstract.entity';
import { UserDto } from '../dtos/user.dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
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

  @OneToMany(() => TodoEntity, (todo) => todo.user)
  todos: TodoEntity[];

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

  dtoClass = UserDto;
}

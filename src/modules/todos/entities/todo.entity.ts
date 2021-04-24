import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'todos' })
export class TodoEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({
    default: false,
  })
  @Column({ default: false })
  isCompleted: boolean;

  @ApiProperty({ type: UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.todos)
  user: UserEntity;
}

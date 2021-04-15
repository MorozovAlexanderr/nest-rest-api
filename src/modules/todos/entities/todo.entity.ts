import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Todo {
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

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}

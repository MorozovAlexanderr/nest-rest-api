import { UserRole } from '../../users/enums/role.enum';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  user: User;
}

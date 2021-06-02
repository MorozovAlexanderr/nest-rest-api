import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/role.enum';
import { UserEntity } from '../entities/user.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  constructor(user: UserEntity) {
    super(user);
    this.username = user.username;
    this.email = user.email;
    this.isActive = user.isActive;
    this.role = user.role;
  }
}

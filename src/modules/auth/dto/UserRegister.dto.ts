import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  username: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(7, 16, {
    message: 'Должен быть не меньше 4 и не больше 16 символов',
  })
  password: string;
}

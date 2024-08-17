import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  username: string;

  @MinLength(4)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @MinLength(2)
  name: string;

  // @IsIn(['Female', 'Male'])
  // gender: string;

  // @IsEmail()
  // email: string;

  // @IsPhoneNumber('KR')
  // phoneNumber: string;
}

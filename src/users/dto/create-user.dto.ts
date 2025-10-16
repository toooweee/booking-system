import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Min(6)
  password: string;
}

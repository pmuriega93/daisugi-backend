import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  fullName: string;
}

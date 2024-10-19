import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(1)
  file: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsArray()
  @IsString(
    { each: true }
  )
  audiences: string[]
}

import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

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
  @Matches('/^(\+?\d{1,3})?[-.\s]?(\(?\d{2,3}?\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/gm')
  phone: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; 

  @IsOptional()
  @IsArray()
  @IsString(
    { each: true }
  )
  audiences: string[]

  @IsOptional()
  @IsArray()
  @IsString(
    { each: true }
  )
  groups: string[]
}

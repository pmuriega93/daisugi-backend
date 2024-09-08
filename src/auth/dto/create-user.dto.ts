import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'El password debe contener una mayúscula, una minúscula y algún caracter especial',
  })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsArray()
  @IsString({ each: true})
  @ArrayMinSize(1)
  @IsOptional()
  roles?: string[]
}

import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
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
  @Matches(/^(\+?\d{1,3})?[-.\s]?(\(?\d{2,3}?\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/gm, {
    message: 'Debe ingresar un número de teléfono válido',
  })
  phone: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true})
  @ArrayMinSize(1)
  @IsOptional()
  roles?: string[]
}

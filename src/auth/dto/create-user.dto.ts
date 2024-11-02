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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'test123@gmail.com',
    description: 'email del usuario',
    uniqueItems: true
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Abc123__',
    description: 'Contraseña del usuario. Debe contener mayúsculas, minúsculas, números y caracteres especiales. Longitud mánima 6 caracteres, máxima 50.',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'El password debe contener una mayúscula, una minúscula y algún caracter especial',
  })
  password: string;

  @ApiProperty({
    example: '1167953233',
    description: 'Teléfono del usuario',
  })
  @IsString()
  @Matches(/^(\+?\d{1,3})?[-.\s]?(\(?\d{2,3}?\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/gm, {
    message: 'Debe ingresar un número de teléfono válido',
  })
  phone: string;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre y apellido del usuario',
  })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({
    example: 'true',
    description: 'Determina si el usuario está activo o inactivo, utilizado para el borrado lógico.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: ['user', 'admin', 'super-user'],
    description: 'Rol del usuario, utilizado para autorización.',
  })
  @IsArray()
  @IsString({ each: true})
  @ArrayMinSize(1)
  @IsOptional()
  roles?: string[]
}

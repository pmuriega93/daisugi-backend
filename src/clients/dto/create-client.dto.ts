import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    example: 'test123@gmail.com',
    description: 'email del cliente',
    uniqueItems: true
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre y apellido del cliente',
  })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({
    example: '1234',
    description: 'id de legajo del usuario',
  })
  @IsString()
  @MinLength(1)
  file: string;

  @ApiProperty({
    example: '1167953233',
    description: 'Teléfono del cliente',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: '1167953233',
    description: 'Fecha de nacimiento del cliente',
  })
  @IsOptional()
  @IsString()
  birthday?: string;


  @ApiProperty({
    example: 'true',
    description: 'Determina si el cliente está activo o inactivo, utilizado para el borrado lógico.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean; 

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString(
    { each: true }
  )
  audiences: string[]

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString(
    { each: true }
  )
  groups: string[]
}

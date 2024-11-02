import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

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
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}
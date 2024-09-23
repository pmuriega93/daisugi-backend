import { IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class ChangePasswordDto {

    @IsString()
    oldPassword: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El password debe contener una mayúscula, una minúscula y algún caracter especial'
    })
    newPassword: string;

}
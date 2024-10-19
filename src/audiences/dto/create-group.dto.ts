import { IsArray, IsString, MinLength } from "class-validator";

export class CreateGroupDto {

    @IsString()
    @MinLength(1)
    description: string;

    @IsString()
    audience: string;   
}

import { IsArray, IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateGroupDto {

    @IsString()
    @MinLength(1)
    description: string;

    @IsString()
    audience: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

import { IsArray, IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateAudienceDto {

    @IsString()
    @MinLength(1)
    description: string;
    
    @IsArray()
    @IsString(
        { each: true }
    )
    type: string[];

    @IsOptional()
    @IsArray()
    @IsString(
        { each: true }
    )
    groups?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

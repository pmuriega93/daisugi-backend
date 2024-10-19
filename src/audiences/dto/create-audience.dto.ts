import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateAudienceDto {

    @IsString()
    @MinLength(1)
    description: string;
    
    @IsArray()
    @IsString(
        { each: true }
    )
    type: string[];

}

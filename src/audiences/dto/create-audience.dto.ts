import { IsArray, IsBoolean, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { ValidAudiences } from "../interfaces/valid-audiences";

export class CreateAudienceDto {

    @IsString()
    @MinLength(1)
    description: string;

    @IsString()
    @IsIn(Object.values(ValidAudiences))
    type: string;

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

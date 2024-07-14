import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Address } from 'nodemailer/lib/mailer';

export class SendEmailDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  from?: Address;

  @IsArray()
  @IsOptional()
  recipients?: Address[];

  @IsString()
  @MinLength(1)
  subject: string;

  @IsString()
  html: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  text?: string;

  @IsOptional()
  placeholderReplacement?: Record<string, string>;

}

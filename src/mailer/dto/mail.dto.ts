import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Address } from 'nodemailer/lib/mailer';

export class SendEmailDto {
  @IsString()
  @IsOptional()
  from?: string;

  @IsArray()
  @IsOptional()
  to?: string[];

  @IsString()
  @MinLength(1)
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  placeholderReplacement?: Record<string, string>;

  @IsString()
  @IsOptional()
  scheduledAt?: string;

}

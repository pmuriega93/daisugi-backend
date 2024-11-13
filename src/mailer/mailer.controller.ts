import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/mail.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { PaginationDto } from "../common/dto/pagination.dto";

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/send-email')
  @Auth()
  async sendMail(
    @Body() sendEmailDto: SendEmailDto,
  ) {
    return await this.mailerService.sendEmail(sendEmailDto);
  }

  @Post('/save-template')
  @Auth()
  async saveMail(
    @Body() sendEmailDto: SendEmailDto,
    @GetUser() user: User,
  ) {
    return this.mailerService.saveTemplate(sendEmailDto, user)
  }

  @Get('/templates')
  @Auth()
  async getTemplates(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ) {
    return this.mailerService.getAllTemplates(paginationDto, user)
  }

  @Delete('/templates/:id')
  @Auth()
  async removeTemplate(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.mailerService.removeTemplate(id, user)
  }


  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.mailerService.forgotPassword(forgotPasswordDto.email)
  }
}

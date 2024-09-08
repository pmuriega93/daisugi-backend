import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/mail.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/send-email')
  async sendMail(
    @Body() sendEmailDto: SendEmailDto,
  ) {
    return await this.mailerService.sendEmail(sendEmailDto);
  }
}

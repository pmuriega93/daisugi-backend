import { Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/mail.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/send-email')
  async sendMail() {
    const dto: SendEmailDto = {
      from: {
        name: 'Cacho',
        address: 'cacho@ejemplo.com',
      },
      recipients: [ { name: 'Patricio muriega', address: 'patriciomuriega@hotmail.com' } ],
      subject: 'Que onda rey',
      html: '<p>Hola capo, como va?</p>'
    }
    return await this.mailerService.sendEmail(dto);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/mail.dto';
import Mail from 'nodemailer/lib/mailer';
@Injectable()
export class MailerService {

    constructor(
        private readonly configService: ConfigService
    ){}

    mailTransport() {
        const transport = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
              user: this.configService.get<string>('EMAIL_USERNAME'),
              pass: this.configService.get<string>('EMAIL_PASSWORD')
            }
        });

        return transport;
    }

    async sendEmail(dto: SendEmailDto) {
        const { recipients, subject, html, placeholderReplacement } = dto;

        const transport = this.mailTransport();

        const options: Mail.Options = {
            from: dto.from ?? {
                name: this.configService.get<string>('APP_NAME'),
                address: this.configService.get<string>('DEFAULT_EMAIL_FROM')
            },
            to: recipients,
            subject,
            html,
        }

        try {
            const result = await transport.sendMail(options);

            return result;
        } catch (error) {
            console.log('error: ', error);
            
        }
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const transport = this.mailTransport();

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
        const mailOptions = {
            from: 'Auth backend service',
            to,
            subject: 'Reseteo de contraseña',
            html: `<p>Solicitaste un cambio de contraseña. Hacé click en el link para resetear tu contraseña:</p><p><a href="${resetLink}">Resetear contraseña</a></p>`
        }

        await transport.sendMail(mailOptions);
    }
}

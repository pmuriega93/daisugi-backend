import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SendEmailDto } from './dto/mail.dto';
import { Resend } from 'resend';
import { User } from 'src/auth/entities/user.entity';
import { Mail } from './entities/mail.entity';
import { DataSource, Repository } from 'typeorm';
import { ResetToken } from 'src/auth/entities/reset-token.entity';
import { nanoid } from 'nanoid';
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class MailerService {
  resend;
  constructor(
    @InjectRepository(Mail)
    private readonly mailRepository: Repository<Mail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>,

    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.resend = new Resend(this.configService.get<string>("RESEND_API_KEY"));
  }

  async sendEmail(dto: SendEmailDto) {
    const { subject, html, from, to } = dto;
    try {
      const data: SendEmailDto = {
        from: "Acme <onboarding@resend.dev>",
        to,
        subject,
        html,
      };

      if (dto.scheduledAt) {
        data.scheduledAt = dto.scheduledAt;
      }

      const resp = await this.resend.emails.send(data);

      return resp;
    } catch (error) {
      this.handleEmailErrors(error);
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: "Acme <onboarding@resend.dev>",
      to: [to],
      subject: "Reseteo de contraseña",
      html: `<p>Solicitaste un cambio de contraseña. Hacé click en el link para resetear tu contraseña:</p><p><a href="${resetLink}">Resetear contraseña</a></p>`,
    };

    await this.sendEmail(mailOptions);
  }

  async saveTemplate(dto: SendEmailDto, user: User) {
    try {
      const { subject, html } = dto;

      const dbMail = this.mailRepository.create({ subject, html, user });

      return await this.mailRepository.save(dbMail);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getAllTemplates(paginationDto: PaginationDto, user: User) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const mails = await this.mailRepository.find({
        take: limit,
        skip: offset,
      });

      return mails.filter(mail => mail.user.id === user.id && mail.isActive);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async removeTemplate(id: string, user: User) {
    try {
      const mail = await this.mailRepository.findOneBy({ id });

      if (!mail) {
          throw new NotFoundException("No existe un template con el id: " + id);
      }

      await this.mailRepository.update(id, {
          isActive: false,
      })

    return `Template with id ${id} deleted succesfully.`
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, id: true }, //! OJO!
    });

    if (user) {
      const resetToken = nanoid(64);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const bdToken = this.resetTokenRepository.create({
        userId: user.id,
        token: resetToken,
        expiryDate,
      });

      await this.resetTokenRepository.save(bdToken);

      await this.sendPasswordResetEmail(email, resetToken);
    }

    return { message: "Si el usuario existe, recibirá un correo electrónico " };
  }

  handleEmailErrors(error: any) {
    console.log(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }

  private handleDBExceptions(error: any) {
    if (error.code === "23505") throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }
}

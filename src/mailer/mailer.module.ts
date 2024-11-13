import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { Mail } from './entities/mail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Mail]), ConfigModule, AuthModule],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}

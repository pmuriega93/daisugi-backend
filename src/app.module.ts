import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { CommonModule } from './common/common.module';
import { MailerModule } from './mailer/mailer.module';
import { AudiencesModule } from './audiences/audiences.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule,
    AuthModule,
    ClientsModule,
    CommonModule,
    AudiencesModule,
  ],
})
export class AppModule {}

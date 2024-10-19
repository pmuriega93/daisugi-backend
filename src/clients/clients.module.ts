import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AudiencesModule } from 'src/audiences/audiences.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), AuthModule, AudiencesModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}

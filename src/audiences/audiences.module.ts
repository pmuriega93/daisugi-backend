import { Module } from '@nestjs/common';
import { AudiencesService } from './audiences.service';
import { AudiencesController } from './audiences.controller';
import { Audience } from './entities/audience.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Group } from './entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audience, Group]), AuthModule],
  controllers: [AudiencesController],
  exports: [AudiencesService],
  providers: [AudiencesService],
})
export class AudiencesModule {}

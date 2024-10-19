import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AudiencesService } from './audiences.service';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { UpdateAudienceDto } from './dto/update-audience.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';

@Controller('audiences')
export class AudiencesController {
  constructor(private readonly audiencesService: AudiencesService) {}

  @Post('create-audience')
  @Auth()
  create(
    @Body() createAudienceDto: CreateAudienceDto,
    @GetUser() user: User
  ) {
    return this.audiencesService.create(createAudienceDto, user);
  }

  @Get('find-all')
  @Auth()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.audiencesService.findAll(paginationDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.audiencesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAudienceDto: UpdateAudienceDto) {
    return this.audiencesService.update(+id, updateAudienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.audiencesService.remove(+id);
  }
}

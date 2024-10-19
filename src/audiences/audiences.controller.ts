import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AudiencesService } from './audiences.service';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { UpdateAudienceDto } from './dto/update-audience.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('audiences')
export class AudiencesController {
  constructor(private readonly audiencesService: AudiencesService) {}

  @Post('create-audience')
  @Auth()
  createAudience(
    @Body() createAudienceDto: CreateAudienceDto,
    @GetUser() user: User
  ) {
    return this.audiencesService.create(createAudienceDto, user);
  }

  @Get('find-all')
  @Auth()
  findAllAudiences(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.audiencesService.findAll(paginationDto, user);
  }

  @Get(':id')
  @Auth()
  findOneAudience(@Param('id') id: string) {
    return this.audiencesService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  updateAudience(@Param('id') id: string, @Body() updateAudienceDto: UpdateAudienceDto) {
    return this.audiencesService.update(+id, updateAudienceDto);
  }

  @Delete(':id')
  removeAudience(@Param('id') id: string) {
    return this.audiencesService.remove(+id);
  }

  
  @Post('create-group')
  @Auth()
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: User
  ) {
    return this.audiencesService.createGroup(createGroupDto, user);
  }

  @Get('groups/:audienceId')
  @Auth()
  findAllGroups(
    @Param('audienceId') audienceId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.audiencesService.findAllGroups(paginationDto, audienceId, user);
  }

  @Get('groups/:audienceId/:id')
  @Auth()
  findOneGroup(
    @Param('audienceId') audienceId: string,
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.audiencesService.findOneGroup(id, audienceId, user);
  }

  @Patch('groups/:id')
  updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.audiencesService.updateGroup(id, updateGroupDto);
  }

  @Delete('groups/:id')
  removeGroup(@Param('id') id: string) {
    return this.audiencesService.removeGroup(id);
  }
}

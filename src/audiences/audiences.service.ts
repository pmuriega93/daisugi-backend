import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { UpdateAudienceDto } from './dto/update-audience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Audience } from './entities/audience.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class AudiencesService {

  constructor(
    @InjectRepository(Audience)
    private readonly audienceRepository: Repository<Audience>,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

  ) {}

 async create(createAudienceDto: CreateAudienceDto, user: User) {
    try {
      const audienceToSave ={
        ...createAudienceDto,
        user,
      };

      const dbAudience = this.audienceRepository.create(audienceToSave);
      
      await this.audienceRepository.save(dbAudience)
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user?: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    const audiences = await this.audienceRepository.find({
      take: limit,
      skip: offset,
    });

    if (user)
      return audiences.filter(audience => audience.user.id === user.id)

    return audiences;
  }

  async findOne(description: string) {
    const audience = await this.audienceRepository.findOneBy( { description } );

    if (!audience)
      throw new NotFoundException(`Audience ${ description } not found`);

    return audience;
  }

  update(id: number, updateAudienceDto: UpdateAudienceDto) {
    return `This action updates a #${id} audience`;
  }

  remove(id: number) {
    return `This action removes a #${id} audience`;
  }


  async createGroup(createGroupDto: CreateGroupDto, user: User) {
    try {

      const { audience, description } = createGroupDto;

      const dbAudience = await this.findOne(audience);

      const { user, ...rest } = dbAudience

      const dbGroup = this.groupRepository.create({ description, audience: rest, user });

      const group = await this.groupRepository.save(dbGroup);

      return group;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllGroups(paginationDto: PaginationDto, audience: string, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    const groups = await this.groupRepository.find({
      take: limit,
      skip: offset,
    });

    
    return groups.filter(group => group.user.id === user.id && group.audience.id === audience)

  }

  async findOneGroup(description: string, audience?: string, user?: User) {
    const group = await this.groupRepository.findOneBy( { description } );

    if (!group)
      throw new NotFoundException(`Group ${ description } not found`);

    return group;
  }

  updateGroup(id: string, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  removeGroup(id: string) {
    return `This action removes a #${id} group`;
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }


}

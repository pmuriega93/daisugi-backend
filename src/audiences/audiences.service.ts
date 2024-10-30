import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { UpdateAudienceDto } from './dto/update-audience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Audience } from './entities/audience.entity';
import { DataSource, Repository } from 'typeorm';
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

    private readonly dataSource: DataSource,

  ) {}

 async create(createAudienceDto: CreateAudienceDto, user: User) {
    try {
      const { groups, ...rest } = createAudienceDto;
      const audienceToSave ={
        ...rest,
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
      return audiences.filter(audience => audience.user.id === user.id &&  audience.isActive)

    return audiences.filter(audience => audience.isActive);
  }

  async findOne(description: string) {
    const audience = await this.audienceRepository.findOneBy( { description } );

    if (!audience || !audience.isActive)
      throw new NotFoundException(`Audience ${ description } not found`);

    return audience;
  }

  async updateAudience(id: string, updateAudienceDto: UpdateAudienceDto, user: User) {
    const toUpdate = updateAudienceDto;

    const groups = toUpdate.groups && await Promise.all(toUpdate.groups.map(group => this.findOneGroup(group))); 

    const audience = await this.audienceRepository.preload({ id, ...toUpdate, groups });

    if (!audience) throw new NotFoundException(`Audience with id ${id} not found.`)

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        audience.user = user;
        await queryRunner.manager.save(audience);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        this.handleDBExceptions(error);
      }

  }

  async removeAudience(id: string, user: User) {
    const audience = await this.findOne( id );

    await this.updateAudience(id, { 
      isActive: false,
     },
     user
    )

    return `Audience with id ${ audience.id } deleted succesfully`;
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

    
    return groups.filter(group => group.user.id === user.id && group.audience.id === audience && group.isActive)

  }

  async findOneGroup(description: string, audience?: string, user?: User) {
    const group = await this.groupRepository.findOneBy( { description } );

    if (!group || !group.isActive || !group.audience)
      throw new NotFoundException(`Group ${ description } not found`);

    if (group.user.id !== user.id)
      throw new NotFoundException(`Group ${ description } not found`);

    return group;
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto, user: User) {
    const toUpdate = updateGroupDto;

    const audience = await this.audienceRepository.findOneBy({ id: toUpdate.audience }); 

    const group = await this.groupRepository.preload({ id, ...toUpdate, audience });

    if (!group) throw new NotFoundException(`Group with id ${id} not found.`)

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        group.user = user;
        await queryRunner.manager.save(group);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        this.handleDBExceptions(error);
      }
  }

  async removeGroup(id: string, user: User) {
    const group = await this.groupRepository.findOneBy( { id } );

    await this.updateGroup(id, { 
      isActive: false,
     },
     user
    )

    return `Group with id ${ group.id } deleted succesfully`;
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }


}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Client } from './entities/client.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { AudiencesService } from 'src/audiences/audiences.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private readonly audienceService: AudiencesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createClientDto: CreateClientDto, user: User) {
    try {
      const { audiences, groups, ...clientDetails } = createClientDto;

      const clientToSave = {
        ...clientDetails,
        user,
        audiences: []
      };

      if(audiences) {
        const audiencesToSave = await Promise.all(audiences.map(audience => this.selectAudience(audience)));
        clientToSave.audiences = audiencesToSave;
      } else {
        delete clientToSave.audiences
      }

      const dbClient = this.clientRepository.create(clientToSave);

      await this.clientRepository.save(dbClient);

      return dbClient;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private async selectAudience(description: string) {
    const bdAudience = await this.audienceService.findOne(description);

    return bdAudience;
  }

  private async selectGroup(description: string) {
    const bdGroup = await this.audienceService.findOneGroup(description);

    return bdGroup;
  }

  async findAll(paginationDto: PaginationDto, user?: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    const clients = await this.clientRepository.find({
      take: limit,
      skip: offset,
    });

    if (user) {
      return clients.filter(client => client.user.id === user.id && client.isActive)
    }

    return clients.filter(client => client.isActive);
  }
  async findOne( term: string ) {

    let client: Client;

    if ( isUUID(term) ) {
      client = await this.clientRepository.findOneBy({ id: term });
    } 

    if ( !client || !client.isActive )
      throw new NotFoundException(`Client with id ${ term } not found`);

    return client;
  }


  async update(id: string, updateClientDto: UpdateClientDto, user: User) {
    const toUpdate = updateClientDto;

    const audiences = toUpdate.audiences && await Promise.all(toUpdate.audiences.map(audience => this.selectAudience(audience)));
    const groups = toUpdate.groups && await Promise.all(toUpdate.groups.map(group => this.selectGroup(group)));

    const client = await this.clientRepository.preload({ id, ...toUpdate, audiences, groups });

    if (!client) throw new NotFoundException(`No se encuentra un cliente con el id ${id}.`) 

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        client.user = user;
        await queryRunner.manager.save(client);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        
        return this.findOne(id)
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        this.handleDBExceptions(error);
      }
  }

  async remove(id: string, user: User) {
    const client = await this.findOne( id );

    if (!client)
      return;
      
    const removed = await this.update(id, { 
      isActive: false,
     },
      user
    )

    return removed;

  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
